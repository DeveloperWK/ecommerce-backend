import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import User from '../../models/userSchema';
import emailVerifiedSuccessMail from '../../utils/emailVerifiedSuccessMail.service';
import generateOtp from '../../utils/generateOtp';
import generateToken from '../../utils/generateToken';
import twoFactorAuthOtp from '../../utils/twoFactorAuth';
import verifyOtpSend from '../../utils/verifyOtpSend.service';
import { loginSchema, registerSchema } from './authValidator';
const login = async (req: Request, res: Response): Promise<void> => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    if (user.is2FAEnabled) {
      const otp = speakeasy.totp({
        secret: user.otpSecret!,
        encoding: 'base32',
      });
      await twoFactorAuthOtp(email, otp);
      res.status(202).json({ message: 'OTP sent. Please verify your 2FA.' });
      return;
    } else if (user.otpVerified) {
      const token = generateToken(user);
      res.status(200).json({
        message: 'Login successful',
        token,
        role: user.role,
      });
    } else {
      res
        .status(401)
        .json({ message: 'User not verified Please verify your email' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  const {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    address,
    confirmPassword,
  } = req.body;
  try {
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }
    const otp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const otpSecret = speakeasy.generateSecret();
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      otp,
      otpExpiry,
      otpSecret: otpSecret.base32,
    });
    await user.save();
    await verifyOtpSend(email, otp);
    res.status(200).json({ message: 'OTP sent. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verify = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ message: 'Email and OTP are required' });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (user.otpVerified) {
      res.status(401).json({ message: 'User already verified' });
      return;
    }
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.otp !== otp || user.otpExpiry! < new Date()) {
      res.status(401).json({ message: 'Invalid or Expired OTP' });
      return;
    }
    const otpUpdate = await User.findOneAndUpdate(
      { email },
      { otp: null, otpExpiry: null, otpVerified: true },
    );
    await emailVerifiedSuccessMail(email);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const twoFactorAuth = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ message: 'Email and OTP are required' });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const validOtp = speakeasy.totp.verify({
      secret: user.otpSecret!,
      encoding: 'base32',
      token: otp,
      window: 1,
    });
    if (!validOtp) {
      res.status(401).json({ message: 'Invalid OTP' });
      return;
    }
    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful & OTP verified',
      token,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.otpVerified) {
      res.status(401).json({ message: 'User already verified' });
      return;
    }
    const otp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const otpUpdate = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
    );
    await verifyOtpSend(email, otp);
    res.status(200).json({ message: 'OTP sent. Please verify your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export { login, register, resendOtp, twoFactorAuth, verify };

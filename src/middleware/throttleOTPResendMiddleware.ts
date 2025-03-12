import { NextFunction, Request, Response } from 'express';
import User from '../models/userSchema';

const throttleOTPResendMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentTime = new Date();
    const otpExpirationTime = user.otpExpiry;

    if (otpExpirationTime instanceof Date && currentTime < otpExpirationTime) {
      const remainingTimeInSeconds = Math.ceil(
        (otpExpirationTime.getTime() - currentTime.getTime()) / 1000,
      );
      const minutes = Math.floor(remainingTimeInSeconds / 60);
      const seconds = remainingTimeInSeconds % 60;

      res.status(429).json({
        error: `Please wait ${minutes} minute(s) and ${seconds} second(s) before requesting a new OTP.`,
      });

      return;
    }

    next();
  } catch (error) {
    console.error('Error in throttleOTPResend middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
export default throttleOTPResendMiddleware;

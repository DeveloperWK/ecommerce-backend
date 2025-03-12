import { Router } from 'express';
import {
  login,
  register,
  resendOtp,
  twoFactorAuth,
  verify,
} from '../controllers/auth/authController';
import throttleOTPResendMiddleware from '../middleware/throttleOTPResendMiddleware';

const router: Router = Router();

router
  .post('/register', register)
  .post('/login', login)
  .post('/verify', verify)
  .post('/two-factor-auth', twoFactorAuth)
  .post('/resend-otp', throttleOTPResendMiddleware, resendOtp);

export default router;

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

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/two-factor-auth', twoFactorAuth);
router.post('/resend-otp', throttleOTPResendMiddleware, resendOtp);

export default router;

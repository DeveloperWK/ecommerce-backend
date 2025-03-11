import { Router } from 'express';
import {
  login,
  register,
  twoFactorAuth,
  verify,
} from '../controllers/auth/authController';

const router: Router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/two-factor-auth', twoFactorAuth);

export default router;

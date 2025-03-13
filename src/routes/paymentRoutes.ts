import { Router } from 'express';
import { stripeSession } from '../controllers/payments/paymentController';
const router: Router = Router();
router.post('/session', stripeSession).post('/webhook', (req, res) => {
  res.json({ message: 'Webhook' });
});

export default router;

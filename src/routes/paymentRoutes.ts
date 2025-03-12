import { Router } from 'express';

const router: Router = Router();
router
  .post('', (req, res) => {
    res.json({ message: 'Create payment' });
  })
  .post('/webhook', (req, res) => {
    res.json({ message: 'Webhook' });
  });

export default router;

import { Router } from 'express';
import {
  getAllOrders,
  getAllUsers,
  updateOrderStatus,
} from '../controllers/admin/adminController';

const router: Router = Router();
router
  .get('/users', getAllUsers)
  .get('/orders', getAllOrders)
  .patch('/orders/:id/status', updateOrderStatus);

export default router;

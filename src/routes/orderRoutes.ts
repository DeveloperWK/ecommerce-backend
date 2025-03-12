import { Router } from 'express';
import {
  createOrder,
  getOrderDetailsById,
  getOrders,
} from '../controllers/orders/orderController';

const router: Router = Router();

router
  .get('', getOrders)
  .get('/:id', getOrderDetailsById)
  .post('', createOrder);

export default router;

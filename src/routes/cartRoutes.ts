import { Router } from 'express';
import {
  cart,
  createCartItem,
  deleteCartItem,
  updateCartItem,
} from '../controllers/cart/cartController';
const router: Router = Router();
router
  .get('', cart)
  .post('/items', createCartItem)
  .patch('/items/:id', updateCartItem)
  .delete('/items/:id', deleteCartItem);

export default router;

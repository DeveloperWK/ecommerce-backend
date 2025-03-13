import { Router } from 'express';
import {
  cart,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from '../controllers/cart/cartController';
const router: Router = Router();
router
  .get('', getCartItems)
  .post('', cart)
  .patch('/items/:id', updateCartItem)
  .delete('/items/:id', deleteCartItem);

export default router;

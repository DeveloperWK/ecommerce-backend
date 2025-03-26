import { Router } from 'express';
import {
  cart,
  deleteCartItem,
  getCartItems,
} from '../controllers/cart/cartController';
const router: Router = Router();
router
  .get('/:userId', getCartItems)
  .post('', cart)
  // .patch('/items/:id', updateCartItem)
  .post('/remove', deleteCartItem);

export default router;

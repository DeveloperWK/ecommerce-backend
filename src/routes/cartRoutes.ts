import { Router } from 'express';
import {
  addToCart,
  deleteCartItem,
  getCartItems,
} from '../controllers/cart/cartController';
const router: Router = Router();
router
  .get('/:userId', getCartItems)
  .post('', addToCart)
  // .patch('/items/:id', updateCartItem)
  .post('/remove', deleteCartItem);

export default router;

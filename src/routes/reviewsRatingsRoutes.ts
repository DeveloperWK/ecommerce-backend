import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getProductsReview,
  updateReview,
} from '../controllers/reviewsRatings/reviewsRatingsController';

const router: Router = Router();

router
  .get('/products/:id', getProductsReview)
  .post('', createReview)
  .patch('/:id', updateReview)
  .delete('/:id', deleteReview);

export default router;

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
  .post('/products/:id', createReview)
  .patch('/:id', updateReview)
  .delete('/:id', deleteReview);

export default router;

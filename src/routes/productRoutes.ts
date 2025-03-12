import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  productSearch,
  updateProduct,
} from '../controllers/products/productsController';

const router: Router = Router();

router
  .get('', getProducts)
  .get('/search', productSearch)
  .get('/:id', getProductById)
  .post('', createProduct)
  .patch('/:id', updateProduct)
  .delete('/:id', deleteProduct);

export default router;

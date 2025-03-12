import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/products/productsController';

const router: Router = Router();

router
  .get('', getAllProducts)
  .get('/:id', getProductById)
  .post('', createProduct)
  .patch('/:id', updateProduct)
  .delete('/:id', deleteProduct);

export default router;

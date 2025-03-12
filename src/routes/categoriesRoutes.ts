import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/categories/categoriesController';

const router: Router = Router();
router
  .get('', getAllCategories)
  .post('', createCategory)
  .patch('/:id', updateCategory)
  .delete('/:id', deleteCategory);

export default router;

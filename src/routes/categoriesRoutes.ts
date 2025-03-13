import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/categories/categoriesController';
import authenticateJWT from '../middleware/authenticateJWT';
import isAdmin from '../middleware/RBAC/isAdmin';

const router: Router = Router();
router
  .get('', getAllCategories)
  .post('', authenticateJWT, isAdmin, createCategory)
  .patch('/:id', updateCategory)
  .delete('/:id', deleteCategory);

export default router;

import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const categoryRouter = Router();

// Rutas públicas
categoryRouter.get('/', asyncHandler(categoryController.getCategories));
categoryRouter.get('/:id', asyncHandler(categoryController.getCategoryById));

// Rutas protegidas (solo superadmin/admin)
categoryRouter.post('/', authenticate, requireRole('superadmin', 'admin'), asyncHandler(categoryController.createCategory));
categoryRouter.put('/:id', authenticate, requireRole('superadmin', 'admin'), asyncHandler(categoryController.editCategory));
categoryRouter.delete('/:id', authenticate, requireRole('superadmin', 'admin'), asyncHandler(categoryController.deleteCategory));

export default categoryRouter;

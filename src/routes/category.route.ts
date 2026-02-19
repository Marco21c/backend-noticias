import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from '../validations/category.schemas.js';

const categoryRouter = Router();

// Públicas
categoryRouter.get(
  '/',
  asyncHandler(categoryController.getCategories)
);

categoryRouter.get(
  '/:id',
  validateRequest({ params: categoryIdParamSchema }),
  asyncHandler(categoryController.getCategoryById)
);

// Protegidas
categoryRouter.post(
  '/',
  authenticate,
  requireRole('superadmin', 'admin'),
  validateRequest({ body: createCategorySchema }),
  asyncHandler(categoryController.createCategory)
);

categoryRouter.put(
  '/:id',
  authenticate,
  requireRole('superadmin', 'admin'),
  validateRequest({ params: categoryIdParamSchema, body: updateCategorySchema }),
  asyncHandler(categoryController.editCategory)
);

categoryRouter.delete(
  '/:id',
  authenticate,
  requireRole('superadmin', 'admin'),
  validateRequest({ params: categoryIdParamSchema }),
  asyncHandler(categoryController.deleteCategory)
);

export default categoryRouter;
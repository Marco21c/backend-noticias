import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const categoryRouter = Router();

// Rutas públicas
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);

// Rutas protegidas (solo superadmin/admin)
categoryRouter.post('/', authenticate, requireRole('superadmin', 'admin'), categoryController.createCategory);
categoryRouter.put('/:id', authenticate, requireRole('superadmin', 'admin'), categoryController.editCategory);
categoryRouter.delete('/:id', authenticate, requireRole('superadmin', 'admin'), categoryController.deleteCategory);

export default categoryRouter;

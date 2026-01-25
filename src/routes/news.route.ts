import { Router } from 'express';
import { newsController } from '../controllers/news.controller.js';
import { authenticate,  requireRole } from '../middlewares/auth.middleware.js';

const newsRouter = Router();


newsRouter.get('/', newsController.getNews);

// Create news: must be authenticated and have editor/admin role
newsRouter.post('/', authenticate, requireRole('editor', 'admin'), newsController.createNews);
newsRouter.get('/category', newsController.getNewsByCategory);
newsRouter.get('/:id',  newsController.getNewsById);

// Edit news: protected, require role
newsRouter.put('/', authenticate, requireRole('editor', 'admin'), newsController.editNews);
newsRouter.delete('/:id', authenticate, requireRole('editor', 'admin'),newsController.deleteNews);

export default newsRouter;
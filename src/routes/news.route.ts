import { Router, type RequestHandler } from 'express';
import { newsController } from '../controllers/news.controller.js';
import { authenticate,  requireRole } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const newsRouter = Router();


newsRouter.get('/', asyncHandler(newsController.getNews));
newsRouter.get('/category', asyncHandler(newsController.getNewsByCategory));
newsRouter.get('/:id',  asyncHandler(newsController.getNewsById));

// Create news: must be authenticated and have editor/admin role
newsRouter.post('/', authenticate, requireRole('editor', 'admin'), asyncHandler(newsController.createNews));

// Edit and delete news: protected, require role
newsRouter.put('/:id', authenticate, requireRole('editor', 'admin'), asyncHandler(newsController.editNews));
newsRouter.delete('/:id', authenticate, requireRole('editor', 'admin'),asyncHandler(newsController.deleteNews));

export default newsRouter;
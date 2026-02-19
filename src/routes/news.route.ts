import { Router } from 'express';
import { newsController } from '../controllers/news.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import {
  createNewsSchema,
  updateNewsSchema,
  newsIdParamSchema,
  newsQuerySchema,
  newsByCategoryQuerySchema,
} from '../validations/news.schemas.js';

const newsRouter = Router();

newsRouter.get(
  '/',
  validateRequest({ query: newsQuerySchema }),
  asyncHandler(newsController.getNews)
);

newsRouter.get(
  '/category',
  validateRequest({ query: newsByCategoryQuerySchema }),
  asyncHandler(newsController.getNewsByCategory)
);

newsRouter.get(
  '/:id',
  validateRequest({ params: newsIdParamSchema }),
  asyncHandler(newsController.getNewsById)
);

newsRouter.post(
  '/',
  authenticate,
  requireRole('editor', 'admin'),
  validateRequest({ body: createNewsSchema }),
  asyncHandler(newsController.createNews)
);

newsRouter.put(
  '/:id',
  authenticate,
  requireRole('editor', 'admin'),
  validateRequest({ params: newsIdParamSchema, body: updateNewsSchema }),
  asyncHandler(newsController.editNews)
);

newsRouter.delete(
  '/:id',
  authenticate,
  requireRole('editor', 'admin'),
  validateRequest({ params: newsIdParamSchema }),
  asyncHandler(newsController.deleteNews)
);

export default newsRouter;
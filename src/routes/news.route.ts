import { Router } from 'express';

import { newsController } from '../controllers/news.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { uploadImage } from '../middlewares/upload.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { USER_ROLES } from '../utils/roles.js';
import {
  createNewsSchema,
  updateNewsSchema,
  newsIdParamSchema,
  newsQuerySchema,
  newsByCategoryQuerySchema,
  searchNewsQuerySchema,
  paginationQuerySchema,
} from '../validations/news.schemas.js';

const newsRouter = Router();

newsRouter.get(
  '/',
  validateRequest({ query: newsQuerySchema.merge(paginationQuerySchema) }),
  asyncHandler(newsController.getNews)
);

newsRouter.get(
  '/category',
  validateRequest({ query: newsByCategoryQuerySchema }),
  asyncHandler(newsController.getNewsByCategory)
);

newsRouter.get(
  '/search',
  validateRequest({ query: searchNewsQuerySchema }),
  asyncHandler(newsController.searchNews)
);

newsRouter.get(
  '/:id',
  validateRequest({ params: newsIdParamSchema }),
  asyncHandler(newsController.getNewsById)
);

newsRouter.post(
  '/',
  authenticate,
  requireRole(USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  uploadImage.single('mainImage'),
  validateRequest({ body: createNewsSchema }),
  asyncHandler(newsController.createNews)
);

newsRouter.put(
  '/:id',
  authenticate,
  requireRole(USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  uploadImage.single('mainImage'),
  validateRequest({ params: newsIdParamSchema, body: updateNewsSchema }),
  asyncHandler(newsController.editNews)
);

newsRouter.delete(
  '/:id',
  authenticate,
  requireRole(USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN),
  validateRequest({ params: newsIdParamSchema }),
  asyncHandler(newsController.deleteNews)
);

export default newsRouter;
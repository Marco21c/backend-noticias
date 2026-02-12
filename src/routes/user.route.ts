import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js'
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
} from '../validations/user.schemas.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get(
  '/',
  authenticate,
  requireRole('admin', 'superadmin'),
  asyncHandler(userController.getUsers)
);

userRouter.post(
  '/',
  authenticate,
  requireRole('admin', 'superadmin'),
  validateRequest({ body: createUserSchema }),
  asyncHandler(userController.createUser)
);

userRouter.get(
  '/:id',
  authenticate,
  requireRole('admin', 'superadmin'),
  validateRequest({ params: userIdParamSchema }),
  asyncHandler(userController.getUserById)
);

userRouter.put(
  '/:id',
  authenticate,
  requireRole('admin', 'superadmin'),
  validateRequest({ params: userIdParamSchema, body: updateUserSchema }),
  asyncHandler(userController.editUser)
);

userRouter.delete(
  '/:id',
  authenticate,
  requireRole('admin', 'superadmin'),
  validateRequest({ params: userIdParamSchema }),
  asyncHandler(userController.deleteUser)
);

export default userRouter;
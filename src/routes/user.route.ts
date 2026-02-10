import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js'
import { 
        createUserSchema,
        updateUserSchema,
        userIdParamSchema 
    } from '../validations/user.schemas.js';

const userRouter = Router();

userRouter.get(
  '/',
  asyncHandler(userController.getUsers)
);

userRouter.post(
  '/',
  validateRequest({ body: createUserSchema }),
  asyncHandler(userController.createUser)
);

userRouter.get(
  '/:id',
  validateRequest({ params: userIdParamSchema }),
  asyncHandler(userController.getUserById)
);

userRouter.put(
  '/:id',
  validateRequest({ params: userIdParamSchema, body: updateUserSchema }),
  asyncHandler(userController.editUser)
);

userRouter.delete(
  '/:id',
  validateRequest({ params: userIdParamSchema }),
  asyncHandler(userController.deleteUser)
);

export default userRouter;
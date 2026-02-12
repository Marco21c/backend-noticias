import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const userRouter = Router();

userRouter.get('/', asyncHandler(userController.getUsers));
userRouter.post('/', asyncHandler(userController.createUser));
// This function will be activated when needed; for now, it is not.
// userRouter.get('/email', userController.getUserByEmail);
userRouter.get('/:id', asyncHandler(userController.getUserById));
userRouter.put('/:id', asyncHandler(userController.editUser));
userRouter.delete('/:id', asyncHandler(userController.deleteUser));

export default userRouter;
import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.post('/', userController.createUser);
// This function will be activated when needed; for now, it is not.
// userRouter.get('/email', userController.getUserByEmail);
userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.editUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
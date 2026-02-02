import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const loginRouter = Router();

loginRouter.post('/login', authController.login);

export default loginRouter;
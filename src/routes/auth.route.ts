import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';


const loginRouter = Router();

loginRouter.post('/login', asyncHandler(authController.login));

export default loginRouter;
import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { loginSchema } from '../validations/auth.schemas.js';
import { requireRole } from '../middlewares/auth.middleware.ts';


const loginRouter = Router();

loginRouter.post(
    '/login',
    validateRequest({ body: loginSchema }),
    asyncHandler(authController.login)
);

export default loginRouter;
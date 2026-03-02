import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.schemas.js';


const loginRouter = Router();

loginRouter.post(
    '/login',
    authLimiter,
    validateRequest({ body: loginSchema }),
    asyncHandler(authController.login)
);

loginRouter.post(
    '/register',
    authLimiter,
    validateRequest({ body: registerSchema }),
    asyncHandler(authController.register)
);

export default loginRouter;
import { Router } from 'express';

import loginRouter from './auth.route.js';
import categoryRouter from './category.route.js';
import newsRouter from './news.route.js';
import newsletterRouter from './newsletter.route.js';
import userRouter from './user.route.js';

const router = Router();
router.use('/news', newsRouter);
router.use('/user', userRouter);
router.use('/auth', loginRouter);
router.use('/categories', categoryRouter);
router.use('/newsletter', newsletterRouter);

export default router;

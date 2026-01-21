import { Router } from 'express';
import newsRouter from './news.route.js';
import userRouter from './user.route.js'


const router = Router();
router.use('/news', newsRouter);
router.use('/user', userRouter)
export default router;

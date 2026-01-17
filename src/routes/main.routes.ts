import { Router } from 'express';
import newsRouter from './news.route.ts';


const router = Router();
router.use('/news', newsRouter);
export default router;

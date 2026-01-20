import { Router } from 'express';
import { newsController } from '../controllers/news.controller.js';

const newsRouter = Router();

newsRouter.get('/', newsController.getNews);
newsRouter.post('/', newsController.createNews);
newsRouter.get('/category', newsController.getNewsByCategory);
newsRouter.get('/:id', newsController.getNewsById);
newsRouter.put('/', newsController.editNews);
newsRouter.delete('/:id', newsController.deleteNews);

export default newsRouter;
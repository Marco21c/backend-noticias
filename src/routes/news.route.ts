import { Router } from 'express';
import { newsController } from '../controllers/news.controller.ts';

const newsRouter = Router();

newsRouter.get('/', newsController.getNews);
newsRouter.post('/', newsController.createNews);
newsRouter.delete('/:id', newsController.deleteNews);
newsRouter.put('/', newsController.editNews);

export default newsRouter;
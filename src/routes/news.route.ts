// TODO: Implementar route de Noticia

import { Router } from 'express';
import { newsController } from '../controllers/news.controller.ts';

const newsRouter = Router();

newsRouter.get('/', newsController.getNews);
newsRouter.post('/', newsController.createNews);
newsRouter.delete('/:id', newsController.deleteNews);

export default newsRouter;
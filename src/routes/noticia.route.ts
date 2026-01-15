// TODO: Implementar route de Noticia

import { Router } from 'express';
import { noticiaController } from '../controllers/noticia.controller.ts';

const noticiaRouter = Router();

noticiaRouter.get('/', noticiaController.getNoticias);


export default noticiaRouter;
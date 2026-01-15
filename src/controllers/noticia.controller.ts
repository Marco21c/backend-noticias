// TODO: Implementar controller de Noticia
import type { Request, Response } from 'express';
import { NoticiaService } from '../services/noticia.services.ts';

export class NoticiaController {

    async getNoticias(req: Request, res: Response): Promise<Response> {
        try {
            const noticias = await new NoticiaService().getAllNoticias();
            return res.status(200).json(noticias);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving noticias', error });
        }
    }
}

export const noticiaController = new NoticiaController();
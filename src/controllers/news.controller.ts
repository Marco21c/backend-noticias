// TODO: Implementar controller de News
import type { Request, Response } from 'express';
import { NewsService } from '../services/news.services.js';

export class NewsController {

    async getNews(req: Request, res: Response): Promise<Response> {
        try {
            const { status, author } = req.query;
            const filters: { status?: string; author?: string } = {};
            
            if (status && typeof status === 'string') {
                filters.status = status;
            }
            
            if (author && typeof author === 'string') {
                filters.author = author;
            }
            
            const news = await new NewsService().getAllNews(
                Object.keys(filters).length > 0 ? filters : undefined
            );
            
            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener noticias', error });
        }
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        try {
            const newsData = req.body;
            const user = (req as any).user;
            
            if (!user || !user._id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            
            // Pasar explícitamente el authorId al service
            const newNews = await new NewsService().createNews(newsData, user._id);
            return res.status(201).json({ message: 'Noticia creada exitosamente', data: newNews });
        } catch (error) {
            return res.status(500).json({ message: 'Error al crear noticia', error });
        }
    }

    async getNewsById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'ID de noticia inválido' });
            }

            const news = await new NewsService().getNewsById(id);

            if (!news) {
                return res.status(404).json({ message: 'Noticia no encontrada' });
            }

            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener noticia', error });
        }
    }

    async getNewsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const category = req.query.category;

            if (!category || typeof category !== 'string') {
                return res.status(400).json({ message: 'Categoría de noticia inválida' });
            }

            const news = await new NewsService().getNewsByCategory(category);

            if (!news || news.length === 0) {
                return res.status(404).json({ message: 'No se encontraron noticias para esta categoría' });
            }

            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener noticias', error });
        }
    }


    async editNews(req: Request, res: Response): Promise<Response> {
        try {
            const idFromParams = req.params.id;
            let id: string | undefined = undefined;

            if (idFromParams && typeof idFromParams === 'string') {
                id = idFromParams;
            } else if (req.query && typeof req.query._id === 'string') {
                id = req.query._id;
            } else if (req.query && Array.isArray(req.query._id) && typeof req.query._id[0] === 'string') {
                id = req.query._id[0];
            }

            const newsData = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID de noticia inválido' });
            }

            const edited = await new NewsService().editNews(id, newsData);

            if (!edited) {
                return res.status(404).json({ message: 'Noticia no encontrada' });
            }

            return res.status(200).json({ message: 'Noticia editada exitosamente', data: edited });
        } catch (error) {
            return res.status(500).json({ message: 'Error al editar noticia', error });
        }
    }

    async deleteNews(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'ID de noticia inválido' });
            }
            
            const deletedNews = await new NewsService().deleteNews(id);
            
            if (!deletedNews) {
                return res.status(404).json({ message: 'Noticia no encontrada' });
            }
            
            return res.status(200).json({ message: 'Noticia eliminada exitosamente', data: deletedNews });
        } catch (error) {
            return res.status(500).json({ message: 'Error al eliminar noticia', error });
        }
    }
       
}

export const newsController = new NewsController();
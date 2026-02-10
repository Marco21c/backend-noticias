import type { Request, Response } from 'express';
import { NewsService } from '../services/news.services.js';

/**
 * NewsController - Capa de presentación/API
 * Responsabilidad: Orquestar requests/responses HTTP
 */
export class NewsController {
    private newsService: NewsService;

    constructor(newsService?: NewsService) {
        this.newsService = newsService || new NewsService();
        
        // Vincular métodos al contexto de la clase
        this.getNews = this.getNews.bind(this);
        this.createNews = this.createNews.bind(this);
        this.getNewsById = this.getNewsById.bind(this);
        this.getNewsByCategory = this.getNewsByCategory.bind(this);
        this.editNews = this.editNews.bind(this);
        this.deleteNews = this.deleteNews.bind(this);
    }

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
            
            const news = await this.newsService.getAllNews(
                Object.keys(filters).length > 0 ? filters : undefined
            );
            
            return res.status(200).json(news);
        } catch (error) {
            console.error('Error en getNews:', error);
            return res.status(500).json({ 
                message: 'Error al obtener noticias', 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        try {
            const newsData = req.body;
            const user = (req as any).user;
            
            if (!user || !user._id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            
            const newNews = await this.newsService.createNews(newsData, user._id);
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
            const news = await this.newsService.getNewsById(id);

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

            const news = await this.newsService.getNewsByCategory(category);

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
            const { id } = req.params;
            const newsData = req.body;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'ID de noticia inválido' });
            }

            const edited = await this.newsService.editNews(id, newsData);

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
            const deletedNews = await this.newsService.deleteNews(id);
            
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
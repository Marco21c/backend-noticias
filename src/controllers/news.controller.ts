import type { NextFunction, Request, Response } from 'express';
import { NewsService } from '../services/news.services.js';
import { AppError } from '../errors/AppError.js';

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

    async getNews(req: Request, res: Response, _next: NextFunction): Promise<Response> {
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
    
    }

    async createNews(req: Request, res: Response, _next: NextFunction): Promise<Response> {
            const newsData = req.body;
            const user = (req as any).user;
            
            if (!user || !user._id) {
                throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
            }
            const newNews = await this.newsService.createNews(newsData, user._id);
            return res
                .status(201)
                .json({ message: 'Noticia creada exitosamente', data: newNews });

    }

    async getNewsById(req: Request, res: Response, _next: NextFunction): Promise<Response> {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
               throw new AppError('ID de noticia invalido', 400, 'INVALID_NEWS_ID'); 
            }
            const news = await this.newsService.getNewsById(id);

            if (!news) {
                throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
            }

            return res.status(200).json(news);
    }

    async getNewsByCategory(req: Request, res: Response, _next: NextFunction): Promise<Response> {
            const category = req.query.category;

            if (!category || typeof category !== 'string') {
                throw new AppError('Categoria de noticia invalida', 400, 'INVALID_NEWS_CATEGORY');
            }

            const news = await this.newsService.getNewsByCategory(category);

            if (!news || news.length === 0) {
                throw new AppError('No se encontraron noticias para esta categoria', 404, 'NEWS_CATEGORY_NOT_FOUND');
            }

            return res.status(200).json(news);
    }


    async editNews(req: Request, res: Response, _next: NextFunction): Promise<Response> {
            const { id } = req.params;
            const newsData = req.body;

            if (!id || typeof id !== 'string') {
                throw new AppError('ID de noticia inválido', 400, 'INVALID_NEWS_ID');
              }
          
              const edited = await this.newsService.editNews(id, newsData);
          
              if (!edited) {
                throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
              }

            return res.status(200).json({ message: 'Noticia editada exitosamente', data: edited });
    }

    async deleteNews(req: Request, res: Response, _next: NextFunction): Promise<Response> {
            const { id } = req.params;
            
            if (!id || typeof id !== 'string') {
                throw new AppError('ID de noticia inválido', 400, 'INVALID_NEWS_ID');
              }
          
              const deletedNews = await this.newsService.deleteNews(id);
          
              if (!deletedNews) {
                throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
              }
            
            return res.status(200).json({ message: 'Noticia eliminada exitosamente', data: deletedNews });
    }
       
}

export const newsController = new NewsController();
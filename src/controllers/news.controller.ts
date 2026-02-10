import type { NextFunction, Request, Response } from 'express';
import { NewsService } from '../services/news.services.js';
import { AppError } from '../errors/AppError.js';
import type { 
    CreateNewsInput, 
    UpdateNewsInput, 
    NewsQuery,
    NewsIdParam,
    NewsByCategoryQuery 
} from '../validations/news.schemas.js';

export class NewsController {
    private newsService: NewsService;

    constructor(newsService?: NewsService) {
        this.newsService = newsService || new NewsService();
        
        this.getNews = this.getNews.bind(this);
        this.createNews = this.createNews.bind(this);
        this.getNewsById = this.getNewsById.bind(this);
        this.getNewsByCategory = this.getNewsByCategory.bind(this);
        this.editNews = this.editNews.bind(this);
        this.deleteNews = this.deleteNews.bind(this);
    }

    async getNews(req: Request, res: Response): Promise<Response> {
        const query = res.locals.validated?.query as NewsQuery | undefined;
        const news = await this.newsService.getAllNews(query);
        return res.status(200).json(news);
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        const newsData = res.locals.validated.body as CreateNewsInput;
        const user = (req as any).user;
        
        if (!user || !user._id) {
            throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
        }
        
        const newNews = await this.newsService.createNews(newsData, user._id);
        return res.status(201).json({ 
            message: 'Noticia creada exitosamente', 
            data: newNews 
        });
    }

    async getNewsById(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdParam;
        const news = await this.newsService.getNewsById(id);

        if (!news) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }

        return res.status(200).json(news);
    }

    async getNewsByCategory(req: Request, res: Response): Promise<Response> {
        const { category } = res.locals.validated.query as NewsByCategoryQuery;
        const news = await this.newsService.getNewsByCategory(category);

        if (!news || news.length === 0) {
            throw new AppError(
                'No se encontraron noticias para esta categoria', 
                404, 
                'NEWS_CATEGORY_NOT_FOUND'
            );
        }

        return res.status(200).json(news);
    }

    async editNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdParam;
        const newsData = res.locals.validated.body as UpdateNewsInput;
        
        const edited = await this.newsService.editNews(id, newsData);
        
        if (!edited) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }

        return res.status(200).json({ 
            message: 'Noticia editada exitosamente', 
            data: edited 
        });
    }

    async deleteNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdParam;
        const deletedNews = await this.newsService.deleteNews(id);
        
        if (!deletedNews) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }
        
        return res.status(200).json({ 
            message: 'Noticia eliminada exitosamente', 
            data: deletedNews 
        });
    }
}

export const newsController = new NewsController();
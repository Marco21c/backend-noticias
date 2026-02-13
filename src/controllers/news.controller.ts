import type { NextFunction, Request, Response } from 'express';
import { NewsService } from '../services/news.services.js';
import { AppError } from '../errors/AppError.js';
import type {
    CreateNewsRequestDto,
    UpdateNewsRequestDto,
    NewsQueryRequestDto,
    NewsIdRequestDto,
    NewsByCategoryRequestDto
} from '../dtos/news.dto.js';
import { toNewsResponseDto, toNewsPublicResponseDto } from '../dtos/news.dto.js';
import { successResponse } from '../dtos/response.dto.js';

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
        const query = res.locals.validated?.query as NewsQueryRequestDto | undefined;
        const news = await this.newsService.getAllNews(query);
        const payload = news.map(toNewsPublicResponseDto); // DTO público sin author.id
        return res.status(200).json(successResponse(payload));
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        const newsData = res.locals.validated.body as CreateNewsRequestDto;
        const user = (req as any).user;
        
        if (!user || !user._id) {
            throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
        }
        
        const newNews = await this.newsService.createNews(newsData, user._id);
        const payload = toNewsResponseDto(newNews);
        return res
            .status(201)
            .json(successResponse(payload, 'Noticia creada exitosamente'));
    }

    async getNewsById(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdRequestDto;
        const news = await this.newsService.getNewsById(id);

        if (!news) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toNewsPublicResponseDto(news))); // DTO público
    }

    async getNewsByCategory(req: Request, res: Response): Promise<Response> {
        const { category } = res.locals.validated.query as NewsByCategoryRequestDto;
        const news = await this.newsService.getNewsByCategory(category);

        if (!news || news.length === 0) {
            throw new AppError(
                'No se encontraron noticias para esta categoria', 
                404, 
                'NEWS_CATEGORY_NOT_FOUND'
            );
        }

        const payload = news.map(toNewsPublicResponseDto); // DTO público
        return res.status(200).json(successResponse(payload));
    }

    async editNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdRequestDto;
        const newsData = res.locals.validated.body as UpdateNewsRequestDto;
        
        const edited = await this.newsService.editNews(id, newsData);
        
        if (!edited) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }

        const payload = toNewsResponseDto(edited);
        return res
            .status(200)
            .json(successResponse(payload, 'Noticia editada exitosamente'));
    }

    async deleteNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdRequestDto;
        const deletedNews = await this.newsService.deleteNews(id);
        
        if (!deletedNews) {
            throw new AppError('Noticia no encontrada', 404, 'NEWS_NOT_FOUND');
        }
        
        const payload = toNewsResponseDto(deletedNews);
        return res
            .status(200)
            .json(successResponse(payload, 'Noticia eliminada exitosamente'));
    }
}

export const newsController = new NewsController();
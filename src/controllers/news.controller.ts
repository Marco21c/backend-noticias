import type { Request, Response } from 'express';

import type {
    CreateNewsRequestDto,
    UpdateNewsRequestDto,
    NewsQueryRequestDto,
    NewsIdRequestDto,
    NewsByCategoryRequestDto,
    SearchNewsRequestDto,
    NewsPaginationQueryDto
} from '../dtos/news.dto.js';
import { toNewsResponseDto, toNewsPublicResponseDto } from '../dtos/news.dto.js';
import { successResponse } from '../dtos/response.dto.js';
import { AppError } from '../errors/AppError.js';
import { CategoryService } from '../services/category.services.js';
import { NewsService } from '../services/news.services.js';

export class NewsController {
    private newsService: NewsService;
    private categoryService: CategoryService;

    constructor(newsService?: NewsService, categoryService?: CategoryService) {
        this.newsService = newsService || new NewsService();
        this.categoryService = categoryService || new CategoryService();
        
        this.getNews = this.getNews.bind(this);
        this.createNews = this.createNews.bind(this);
        this.getNewsById = this.getNewsById.bind(this);
        this.getNewsByCategory = this.getNewsByCategory.bind(this);
        this.searchNews = this.searchNews.bind(this);
        this.editNews = this.editNews.bind(this);
        this.deleteNews = this.deleteNews.bind(this);
    }

    async getNews(req: Request, res: Response): Promise<Response> {
        const query = res.locals.validated?.query as NewsQueryRequestDto | undefined;
        const pagination = res.locals.validated?.query as NewsPaginationQueryDto | undefined;
        
        const result = await this.newsService.getNewsPaginated(query, {
            page: pagination?.page || 1,
            limit: pagination?.limit || 10
        });
        
        const payload = {
            items: result.results.map(toNewsPublicResponseDto),
            pagination: {
                total: result.total,
                page: result.page,
                limit: pagination?.limit || 10,
                totalPages: result.totalPages
            }
        };
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
        
        // Validar que la categoría existe
        const categoryExists = await this.categoryService.getCategoryById(category);
        if (!categoryExists) {
            throw new AppError(
                'Categoría no encontrada', 
                404, 
                'CATEGORY_NOT_FOUND'
            );
        }
        
        // Buscar noticias de la categoría (puede ser array vacío)
        const news = await this.newsService.getNewsByCategory(category);
        const payload = news.map(toNewsPublicResponseDto); // DTO público
        return res.status(200).json(successResponse(payload));
    }

    async searchNews(req: Request, res: Response): Promise<Response> {
        const { q, page, limit } = res.locals.validated.query as SearchNewsRequestDto;
        
        const result = await this.newsService.searchByKeyword(
            q,
            page || 1,
            limit || 10
        );
        
        const payload = result.results.map(toNewsPublicResponseDto);
        
        return res.status(200).json(
            successResponse(
                {
                    items: payload,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: limit || 10,
                        totalPages: result.totalPages
                    },
                    query: q
                },
                `Se encontraron ${result.total} resultado(s) para "${q}"`
            )
        );
    }

    async editNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdRequestDto;
        const newsData = res.locals.validated.body as UpdateNewsRequestDto;
        const user = (req as any).user;

        const edited = await this.newsService.editNews(
            id,
            newsData,
            user?._id,
            user?.role
        );

        const payload = toNewsResponseDto(edited);
        return res
            .status(200)
            .json(successResponse(payload, 'Noticia actualizada exitosamente'));
    }

    async deleteNews(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as NewsIdRequestDto;
        const user = (req as any).user;

        const deletedNews = await this.newsService.deleteNews(
            id,
            user?._id,
            user?.role
        );

        const payload = toNewsResponseDto(deletedNews);
        return res
            .status(200)
            .json(successResponse(payload, 'Noticia eliminada exitosamente'));
    }
}

export const newsController = new NewsController();
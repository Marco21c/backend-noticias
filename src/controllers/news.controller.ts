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
            return res.status(500).json({ message: 'Error retrieving news', error });
        }
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        try {
            const newsData = req.body;
            const user = (req as any).user;
            
            if (!user || !user._id) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            
            // Pasar explícitamente el authorId al service
            const newNews = await new NewsService().createNews(newsData, user._id);
            return res.status(201).json({ message: 'News created successfully', data: newNews });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating news', error });
        }
    }

    async getNewsById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'Invalid news ID' });
            }

            const news = await new NewsService().getNewsById(id);

            if (!news) {
                return res.status(404).json({ message: 'News not found' });
            }

            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving news', error });
        }
    }

    async getNewsByCategory(req: Request, res: Response): Promise<Response> {
        try {
            const category = req.query.category;

            if (!category || typeof category !== 'string') {
                return res.status(400).json({ message: 'Invalid news Category' });
            }

            const news = await new NewsService().getNewsByCategory(category);

            if (!news || news.length === 0) {
                return res.status(404).json({ message: 'No news found for this category' });
            }

            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving news', error });
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
                return res.status(400).json({ message: 'Invalid news ID' });
            }

            const edited = await new NewsService().editNews(id, newsData);

            if (!edited) {
                return res.status(404).json({ message: 'News not found' });
            }

            return res.status(200).json({ message: 'News edited successfully', data: edited });
        } catch (error) {
            return res.status(500).json({ message: 'Error editing news', error });
        }
    }

    async deleteNews(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: 'Invalid news ID' });
            }
            
            const deletedNews = await new NewsService().deleteNews(id);
            
            if (!deletedNews) {
                return res.status(404).json({ message: 'News not found' });
            }
            
            return res.status(200).json({ message: 'News deleted successfully', data: deletedNews });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting news', error });
        }
    }
       
}

export const newsController = new NewsController();
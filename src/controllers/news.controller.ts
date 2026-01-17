// TODO: Implementar controller de News
import type { Request, Response } from 'express';
import { NewsService } from '../services/news.services.ts';

export class NewsController {

    async getNews(req: Request, res: Response): Promise<Response> {
        try {
            const news = await new NewsService().getAllNews();
            return res.status(200).json(news);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving news', error });
        }
    }

    async createNews(req: Request, res: Response): Promise<Response> {
        try {
            const newsData = req.body;
            const newNews = await new NewsService().createNews(newsData);
            return res.status(201).json({ message: 'News created successfully', data: newNews });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating news', error });
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
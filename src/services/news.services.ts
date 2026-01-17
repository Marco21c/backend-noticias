// TODO: Implementar logica de servicio para noticias

import type { INews } from '../interfaces/news.interface.ts';
import NewsModel from '../models/news.model.ts';

export class NewsService {

    async getAllNews(): Promise<INews[]> {
        return NewsModel.find();
    }

    async editNews(id: string, newsData: Partial<INews>): Promise<INews | null> {
        return NewsModel.findByIdAndUpdate(id, newsData, { new: true });
    }
    
    async createNews(newsData: INews): Promise<INews> {
        const newNews = new NewsModel(newsData);
        return newNews.save();
    }

    async deleteNews(id: string): Promise<INews | null> {
        return NewsModel.findByIdAndDelete(id);
    }
};
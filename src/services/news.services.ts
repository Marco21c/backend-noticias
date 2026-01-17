// TODO: Implementar logica de servicio para noticias

import type { INew } from '../interfaces/news.interface.ts';
import NewsModel from '../models/news.model.ts';

export class NewsService {

    async getAllNews(): Promise<INew[]> {
        return NewsModel.find();
    }

    async createNews(newsData: INew): Promise<INew> {
        const newNews = new NewsModel(newsData);
        return newNews.save();
    }

    async deleteNews(id: string): Promise<INew | null> {
        return NewsModel.findByIdAndDelete(id);
    }
};
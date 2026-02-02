
import type { INews } from '../interfaces/news.interface.js';
import NewsModel from '../models/news.model.js';
import { Types } from 'mongoose';

export class NewsService {

    async getAllNews(filters?: { status?: string; author?: string }): Promise<INews[]> {
        const query: any = {};
        
        if (filters?.status) {
            query.status = filters.status;
        }
        
        if (filters?.author) {
            try {
                query.author = new Types.ObjectId(filters.author);
            } catch {
                // Si no es un ObjectId válido, devolver array vacío
                return [];
            }
        }
        
        return NewsModel.find(query).exec();
    }

    async createNews(
        newsData: Omit<INews, 'author' | 'status' | 'publicationDate'>,
        authorId: Types.ObjectId
    ): Promise<INews> {
        const newNews = new NewsModel({
            ...newsData,
            author: authorId,
            status: 'draft',
            publicationDate: null
        });
        return newNews.save();
    }

    async getNewsById(id: string): Promise<INews | null> {
        return NewsModel.findById(id);
    }

    async getNewsByCategory(category: string): Promise<INews[]> {
        return NewsModel.find({ category }).exec();
    }

    async editNews(id: string, newsData: Partial<INews>): Promise<INews | null> {
        return NewsModel.findByIdAndUpdate(id, newsData, { new: true });
    }

    async deleteNews(id: string): Promise<INews | null> {
        return NewsModel.findByIdAndDelete(id);
    }
};
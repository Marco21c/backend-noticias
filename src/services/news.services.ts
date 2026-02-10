import type { INews } from '../interfaces/news.interface.js';
import { NewsRepository } from '../repositories/news.repository.js';
import { Types } from 'mongoose';

/**
 * NewsService - Capa de lógica de negocio para News
 * Responsabilidad: Procesar y validar reglas de negocio
 * Independiente de Express y de la base de datos
 */
export class NewsService {
    private newsRepository: NewsRepository;

    constructor(newsRepository?: NewsRepository) {
        this.newsRepository = newsRepository || new NewsRepository();
    }

    /**
     * Obtener todas las noticias con filtros opcionales
     */
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
        
        return this.newsRepository.findAll(query);
    }

    /**
     * Crear una nueva noticia
     * Aplica reglas de negocio: estado inicial 'draft', fecha de publicación null
     */
    async createNews(
        newsData: Omit<INews, 'author' | 'status' | 'publicationDate'>,
        authorId: Types.ObjectId
    ): Promise<INews> {
        const newsToCreate = {
            ...newsData,
            author: authorId,
            status: 'draft' as const,
            publicationDate: null
        };
        
        return this.newsRepository.create(newsToCreate);
    }

    /**
     * Obtener noticia por ID
     */
    async getNewsById(id: string): Promise<INews | null> {
        return this.newsRepository.findById(id);
    }

    /**
     * Obtener noticias por categoría
     */
    async getNewsByCategory(category: string): Promise<INews[]> {
        return this.newsRepository.findByCategory(category);
    }

    /**
     * Editar una noticia existente
     */
    async editNews(id: string, newsData: Partial<INews>): Promise<INews | null> {
        return this.newsRepository.update(id, newsData);
    }

    /**
     * Eliminar una noticia
     */
    async deleteNews(id: string): Promise<INews | null> {
        return this.newsRepository.delete(id);
    }
};
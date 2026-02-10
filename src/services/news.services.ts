import type { INews } from '../interfaces/news.interface.js';
import { NewsRepository } from '../repositories/news.repository.js';
import { Types } from 'mongoose';
import type { CreateNewsInput, UpdateNewsInput, NewsQuery } from '../validations/news.schemas.js';

export class NewsService {
    private newsRepository: NewsRepository;

    constructor(newsRepository?: NewsRepository) {
        this.newsRepository = newsRepository || new NewsRepository();
    }

    /**
     * Obtener todas las noticias con filtros opcionales
     * @param filters - Query params validados (futuro: NewsQueryDto)
     */
    async getAllNews(filters?: NewsQuery): Promise<INews[]> {
        const query: any = {};
      
        if (filters?.status) {
          query.status = filters.status;
        }
      
        if (filters?.author) {
          try {
            query.author = new Types.ObjectId(filters.author);
          } catch {
            return [];
          }
        }
      
        return this.newsRepository.findAll(query);
    }

    /**
     * Crear una nueva noticia
     * @param newsData - Datos validados (futuro: CreateNewsDto)
     * @param authorId - ID del autor autenticado
     */
    async createNews(
        newsData: CreateNewsInput,
        authorId: Types.ObjectId
    ): Promise<INews> {
      const newsToCreate = this.cleanUndefined({
        ...newsData,
        author: authorId,
        status: 'draft' as const,
        publicationDate: null
    }) as Partial<INews>;
        
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
     * @param id - ID de la noticia
     * @param newsData - Datos a actualizar (futuro: UpdateNewsDto)
     */
    async editNews(id: string, newsData: UpdateNewsInput): Promise<INews | null> {
      const cleanedData = this.cleanUndefined(newsData) as Partial<INews>;
      return this.newsRepository.update(id, cleanedData);
  }

    /**
     * Eliminar una noticia
     */
    async deleteNews(id: string): Promise<INews | null> {
        return this.newsRepository.delete(id);
    }

    // ========== Método privado helper ==========
    
    /**
     * Elimina propiedades undefined del objeto
     */
    private cleanUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
      const result: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
              result[key] = value;
          }
      }
      
      return result;
  }
}
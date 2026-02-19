import type { INews } from '../interfaces/news.interface.js';
import { NewsRepository } from '../repositories/news.repository.js';
import { Types } from 'mongoose';
import { cleanUndefined } from '../helpers/cleanUndefined.js';
import type {
  CreateNewsRequestDto,
  UpdateNewsRequestDto,
  NewsQueryRequestDto
} from '../dtos/news.dto.js';

/**
 * Servicio para la gestión de noticias.
 * Contiene la lógica de negocio y orquesta las operaciones con el repositorio.
 *
 * @example
 * ```typescript
 * const newsService = new NewsService();
 * const news = await newsService.createNews(data, authorId);
 * ```
 */
export class NewsService {
  private newsRepository: NewsRepository;

  /**
   * Crea una instancia del servicio de noticias.
   *
   * @param newsRepository - Repositorio opcional para inyección de dependencias
   */
  constructor(newsRepository?: NewsRepository) {
    this.newsRepository = newsRepository || new NewsRepository();
  }

  /**
   * Obtiene todas las noticias aplicando filtros opcionales.
   *
   * @param filters - Filtros opcionales para la consulta
   * @param filters.status - Filtrar por estado de la noticia
   * @param filters.author - Filtrar por ID del autor
   * @returns Array de noticias que cumplen los filtros
   */
  async getAllNews(filters?: NewsQueryRequestDto): Promise<INews[]> {
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
   * Crea una nueva noticia en estado borrador.
   *
   * @param newsData - Datos validados de la noticia
   * @param authorId - ID del usuario autor autenticado
   * @returns Noticia creada con ID asignado
   */
  async createNews(
    newsData: CreateNewsRequestDto,
    authorId: Types.ObjectId
  ): Promise<INews> {
    const newsToCreate = cleanUndefined({
      ...newsData,
      author: authorId,
      status: 'draft' as const,
      publicationDate: null
    }) as Partial<INews>;

    return this.newsRepository.create(newsToCreate);
  }

  /**
   * Obtiene una noticia específica por su ID.
   *
   * @param id - ID de la noticia a buscar
   * @returns Noticia encontrada o null si no existe
   */
  async getNewsById(id: string): Promise<INews | null> {
    return this.newsRepository.findById(id);
  }

  /**
   * Obtiene todas las noticias de una categoría específica.
   *
   * @param category - ID de la categoría
   * @returns Array de noticias de la categoría
   */
  async getNewsByCategory(category: string): Promise<INews[]> {
    return this.newsRepository.findByCategory(category);
  }

  /**
   * Actualiza una noticia existente.
   *
   * @param id - ID de la noticia a actualizar
   * @param newsData - Datos a actualizar
   * @returns Noticia actualizada o null si no existe
   */
  async editNews(id: string, newsData: UpdateNewsRequestDto): Promise<INews | null> {
    const cleanedData = cleanUndefined(newsData) as Partial<INews>;
    return this.newsRepository.update(id, cleanedData);
  }

  /**
   * Elimina una noticia del sistema.
   *
   * @param id - ID de la noticia a eliminar
   * @returns Noticia eliminada o null si no existe
   */
  async deleteNews(id: string): Promise<INews | null> {
    return this.newsRepository.delete(id);
  }
}
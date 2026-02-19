import type { INews } from '../interfaces/news.interface.js';
import { NewsRepository } from '../repositories/news.repository.js';
import { Types } from 'mongoose';
import { cleanUndefined } from '../helpers/cleanUndefined.js';
import type { IPaginatedResponse } from '../interfaces/pagination.interface.js';
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

  /**
   * Busca noticias que contengan una palabra clave específica.
   * 
   * Utiliza índices de texto de MongoDB para búsqueda eficiente.
   * Retorna resultados ordenados por relevancia (textScore).
   * Soporta paginación para manejar grandes volúmenes de datos.
   *
   * @param q - Palabra clave o término de búsqueda
   * @param page - Número de página (default: 1)
   * @param limit - Cantidad de resultados por página (default: 10, max: 50)
   * @returns Objeto con resultados paginados y metadata
   * 
   * @example
   * ```typescript
   * const results = await newsService.searchByKeyword('tecnología', 1, 10);
   * // { results: [...], total: 45, page: 1, totalPages: 5 }
   * ```
   */
  async searchByKeyword(
    q: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginatedResponse<INews>> {
    // Validar que el término de búsqueda no esté vacío
    if (!q || q.trim().length === 0) {
      return { results: [], total: 0, page: 1, totalPages: 0 };
    }

    // Sanitizar el término de búsqueda
    const sanitizedQuery = this.sanitizeSearchQuery(q.trim());

    // Validar y normalizar parámetros de paginación
    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(50, Math.max(1, limit)); // Max 50 resultados

    return this.newsRepository.searchByKeyword(sanitizedQuery, {
      page: normalizedPage,
      limit: normalizedLimit
    });
  }

  /**
   * Sanitiza el query de búsqueda para prevenir inyecciones
   * @param query - Query sin sanitizar
   * @returns Query sanitizado
   */
  private sanitizeSearchQuery(query: string): string {
    // Escapar caracteres especiales de regex para búsqueda segura
    return query
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .substring(0, 100); // Limitar longitud máxima
  }
}
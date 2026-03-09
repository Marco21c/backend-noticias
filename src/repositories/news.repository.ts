import type { Types } from 'mongoose';

import type { INews } from '../interfaces/news.interface.js';
import type { IPaginationOptions, IPaginatedResponse } from '../interfaces/pagination.interface.js';
import NewsModel from '../models/news.model.js';

/**
 * NewsRepository - Capa de acceso a datos para News
 * Responsabilidad: Solo operaciones CRUD con la base de datos
 */
export class NewsRepository {
	/**
	 * Obtener todas las noticias con filtros opcionales
	 */
	async findAll(query: any = {}): Promise<INews[]> {
		return NewsModel.find(query)
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();
	}

	/**
	 * Obtener todas las noticias con paginación y filtros opcionales
	 */
	async findAllPaginated(
		query: any = {},
		options: IPaginationOptions = {}
	): Promise<IPaginatedResponse<INews>> {
		const page = Math.max(1, options.page || 1);
		const limit = Math.max(1, Math.min(50, options.limit || 10));
		const skip = (page - 1) * limit;

		const results = await NewsModel.find(query)
			.sort({ publicationDate: -1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();

		const total = await NewsModel.countDocuments(query).exec();

		return {
			results,
			total,
			page,
			totalPages: Math.ceil(total / limit)
		};
	}

	/**
	 * Buscar noticia por ID
	 */
	async findById(id: string): Promise<INews | null> {
		return NewsModel.findById(id)
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();
	}

	/**
	 * Buscar noticias por categoría
	 */
	async findByCategory(category: string): Promise<INews[]> {
		return NewsModel.find({ category })
			.sort({ publicationDate: -1 })
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();
	}

	/**
	 * Buscar noticias publicadas por categorías
	 */
	async findPublishedByCategories(
		categoryIds: Types.ObjectId[],
		limit: number
	): Promise<INews[]> {
		const query = {
			status: 'published',
			category: { $in: categoryIds },
		};
		return NewsModel.find(query)
			.sort({ publicationDate: -1 })
			.limit(limit)
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();
	}

	/**
	 * Crear una nueva noticia
	 */
	async create(newsData: Partial<INews>): Promise<INews> {
		const news = new NewsModel(newsData);
		return news.save();
	}

	/**
	 * Actualizar una noticia existente
	 */
	async update(id: string, newsData: Partial<INews>): Promise<INews | null> {
		return NewsModel.findByIdAndUpdate(id, newsData, { new: true, runValidators: true })
			.populate('category', 'name')
			.populate('author', 'name')
			.exec();
	}

	/**
	 * Eliminar una noticia
	 */
	async delete(id: string): Promise<INews | null> {
		return NewsModel.findByIdAndDelete(id).exec();
	}

	/**
	 * Buscar noticias por autor
	 */
	async findByAuthor(authorId: Types.ObjectId): Promise<INews[]> {
		return NewsModel.find({ author: authorId }).exec();
	}

	/**
	 * Buscar noticias por estado
	 */
	async findByStatus(status: string): Promise<INews[]> {
		return NewsModel.find({ status }).exec();
	}

	/**
	 * Busca noticias por palabra clave con coincidencia parcial.
	 *
	 * Busca en `title`, `summary`, `content` y `highlights` usando regex.
	 * Retorna noticias ordenadas por fecha descendente.
	 *
	 * @param keyword - Palabra clave a buscar (ya sanitizada por el servicio)
	 * @param options - Opciones de paginación
	 * @returns Noticias ordenadas por fecha descendente
	 */
	async searchByKeyword(
		keyword: string,
		options: IPaginationOptions = {}
	): Promise<IPaginatedResponse<INews>> {
		// Validación defensiva: asegurar valores válidos
		const page = Math.max(1, options.page || 1);
		const limit = Math.max(1, options.limit || 10);
		const skip = (page - 1) * limit;

		// El keyword ya viene sanitizado por el servicio con soporte a acentos
		// No re-sanitizar para evitar romper el patrón de caracteres
		const regex = new RegExp(keyword, 'i');
		const filter = {
			status: 'published',
			$or: [
				{ title: { $regex: regex } },
				{ summary: { $regex: regex } },
				{ content: { $regex: regex } },
				{ highlights: { $regex: regex } }
			]
		};

		const results = await NewsModel.find(filter)
			.sort({
				publicationDate: -1
			})
			.skip(skip)
			.limit(limit)
			.populate('category', 'name')
			.populate('author', 'name')
			.lean()
			.exec();

		const total = await NewsModel.countDocuments(filter).exec();

		return {
			results,
			total,
			page,
			totalPages: Math.ceil(total / limit)
		};
	}
}

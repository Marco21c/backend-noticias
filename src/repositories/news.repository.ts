import type { INews } from '../interfaces/news.interface.js';
import NewsModel from '../models/news.model.js';
import type { Types } from 'mongoose';

/**
 * NewsRepository - Capa de acceso a datos para News
 * Responsabilidad: Solo operaciones CRUD con la base de datos
 */
export class NewsRepository {
	/**
	 * Obtener todas las noticias con filtros opcionales
	 */
	async findAll(query: any = {}): Promise<INews[]> {
		return NewsModel.find(query).exec();
	}

	/**
	 * Buscar noticia por ID
	 */
	async findById(id: string): Promise<INews | null> {
		return NewsModel.findById(id).exec();
	}

	/**
	 * Buscar noticias por categoría
	 */
	async findByCategory(category: string): Promise<INews[]> {
		return NewsModel.find({ category }).exec();
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
		return NewsModel.findByIdAndUpdate(id, newsData, { new: true }).exec();
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
}

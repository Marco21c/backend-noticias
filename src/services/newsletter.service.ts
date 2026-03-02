import { Types } from 'mongoose';

import { AppError } from '../errors/AppError.js';
import type { INews } from '../interfaces/news.interface.js';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import { newsletterRepository } from '../repositories/newsletter.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

import { NewsService } from './news.services.js';

const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

/**
 * Servicio para la gestión de suscripciones al newsletter.
 * Maneja suscripciones, preferencias y recuperación de noticias para suscriptores.
 * 
 * @example
 * ```typescript
 * const newsletterService = new NewsletterService();
 * await newsletterService.subscribe(user, ['categoryId1', 'categoryId2']);
 * ```
 */
export class NewsletterService {
	private repository = newsletterRepository;
	private newsService = new NewsService();

	/**
	 * Suscribe un usuario al newsletter.
	 * @param user - Usuario a suscribir
	 * @param preferredCategories - Array de IDs de categorías preferidas
	 * @returns Suscripción creada
	 * @throws AppError si el usuario ya está suscrito
	 */
	async subscribe(
		user: IUser,
		preferredCategories: string[] = []
	): Promise<INewsletter> {
		const existingSubscription = await this.repository.findByUserId(
			user._id as string
		);

		if (existingSubscription) {
			throw new AppError(
				'El usuario ya está suscrito al newsletter',
				409,
				'NEWSLETTER_ALREADY_SUBSCRIBED'
			);
		}

		if (preferredCategories.length > 0) {
			const validCategories = await categoryRepository.findByIds(preferredCategories);
			if (validCategories.length !== preferredCategories.length) {
				throw new AppError(
					'Una o más categorías no existen',
					400,
					'INVALID_CATEGORIES'
				);
			}
		}

		const categoryIds = preferredCategories.map(
			(catId) => new Types.ObjectId(catId)
		);

		const newsletter = await this.repository.create({
			user: new Types.ObjectId(user._id),
			preferredCategories: categoryIds,
			isActive: true,
		});

		return newsletter;
	}

	/**
	 * Actualiza las preferencias de categorías del usuario.
	 * @param userId - ID del usuario
	 * @param preferredCategories - Nuevo array de IDs de categorías
	 * @returns Suscripción actualizada
	 * @throws AppError si la suscripción no existe o está inactiva
	 */
	async updatePreferences(
		userId: string,
		preferredCategories: string[]
	): Promise<INewsletter> {
		const newsletter = await this.repository.findByUserId(userId);

		if (!newsletter) {
			throw new AppError(
				'No se encontró la suscripción al newsletter',
				404,
				'NEWSLETTER_NOT_FOUND'
			);
		}

		if (!newsletter.isActive) {
			throw new AppError(
				'La suscripción está inactiva. Reactívela primero.',
				400,
				'NEWSLETTER_INACTIVE'
			);
		}

		if (preferredCategories.length > 0) {
			const validCategories = await categoryRepository.findByIds(preferredCategories);
			if (validCategories.length !== preferredCategories.length) {
				throw new AppError(
					'Una o más categorías no existen',
					400,
					'INVALID_CATEGORIES'
				);
			}
		}

		const categoryIds = preferredCategories.map(
			(catId) => new Types.ObjectId(catId)
		);

		const updated = await this.repository.updateByUserId(userId, {
			preferredCategories: categoryIds,
		});

		if (!updated) {
			throw new AppError(
				'Error al actualizar las preferencias',
				500,
				'NEWSLETTER_UPDATE_ERROR'
			);
		}

		return updated;
	}

	/**
	 * Desuscribe un usuario del newsletter.
	 * @param userId - ID del usuario
	 * @returns Suscripción actualizada con isActive false
	 * @throws AppError si la suscripción no existe o ya está inactiva
	 */
	async unsubscribe(userId: string): Promise<INewsletter> {
		const newsletter = await this.repository.findByUserId(userId);

		if (!newsletter) {
			throw new AppError(
				'No se encontró la suscripción al newsletter',
				404,
				'NEWSLETTER_NOT_FOUND'
			);
		}

		if (!newsletter.isActive) {
			throw new AppError(
				'La suscripción ya está inactiva',
				400,
				'NEWSLETTER_ALREADY_INACTIVE'
			);
		}

		const updated = await this.repository.unsubscribe(userId);

		if (!updated) {
			throw new AppError(
				'Error al desuscribir',
				500,
				'NEWSLETTER_UNSUBSCRIBE_ERROR'
			);
		}

		return updated;
	}

	/**
	 * Obtiene la suscripción actual del usuario.
	 * @param userId - ID del usuario
	 * @returns Suscripción al newsletter o null
	 */
	async getMySubscription(userId: string): Promise<INewsletter | null> {
		return await this.repository.findByUserId(userId);
	}

	/**
	 * Obtiene todos los suscriptores activos.
	 * @returns Array de suscripciones activas
	 */
	async getAllActiveSubscribers(): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribers();
	}

	/**
	 * Obtiene un suscriptor por ID.
	 * @param id - ID de la suscripción
	 * @returns Suscripción al newsletter o null
	 */
	async getSubscriberById(id: string): Promise<INewsletter | null> {
		return await this.repository.findById(id);
	}

	/**
	 * Obtiene un suscriptor por email.
	 * @param email - Email del usuario
	 * @returns Suscripción al newsletter o null
	 */
	async getSubscriberByEmail(email: string): Promise<INewsletter | null> {
		const user = await userRepository.findByEmail(email);
		if (!user) return null;

		return await this.repository.findByUserId(user._id as string);
	}

	/**
	 * Obtiene suscriptores por categoría preferida.
	 * @param categoryId - ID de la categoría
	 * @returns Array de suscripciones con la categoría preferida
	 */
	async getSubscribersByCategory(categoryId: string): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribersByCategory(categoryId);
	}

	/**
	 * Obtiene las últimas noticias para un usuario según sus preferencias.
	 * @param userId - ID del usuario
	 * @param limit - Cantidad máxima de noticias a retornar
	 * @returns Array de noticias
	 * @throws AppError si la suscripción no existe o está inactiva
	 */
	async getLatestNewsForUser(
		userId: string,
		limit: number = 10
	): Promise<INews[]> {
		const newsletter = await this.repository.findByUserId(userId);

		if (!newsletter) {
			throw new AppError(
				'No se encontró la suscripción al newsletter',
				404,
				'NEWSLETTER_NOT_FOUND'
			);
		}

		if (!newsletter.isActive) {
			throw new AppError(
				'La suscripción está inactiva. Reactívela primero.',
				400,
				'NEWSLETTER_INACTIVE'
			);
		}

		const categories = Array.isArray(newsletter.preferredCategories)
			? newsletter.preferredCategories.map((cat: unknown) => {
					if (typeof cat === 'object' && cat !== null && '_id' in cat) {
						const id = (cat as { _id: unknown })._id;
						return id instanceof Types.ObjectId
							? id.toString()
							: String(id);
					}
					if (cat instanceof Types.ObjectId) {
						return cat.toString();
					}
					return String(cat);
			  })
			: [];

		if (categories.length === 0) {
			return [];
		}

		const news = await this.newsService.getLatestPublishedByCategories(categories, limit);
		return news;
	}
}

export const newsletterService = new NewsletterService();

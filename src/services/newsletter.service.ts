import { newsletterRepository } from '../repositories/newsletter.repository.js';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../errors/AppError.js';
import { Types } from 'mongoose';

export class NewsletterService {
	private repository = newsletterRepository;

	/**
	 * Suscribir un usuario al newsletter
	 * @param user - Usuario autenticado
	 * @param preferredCategories - IDs de categorías preferidas (máx 3)
	 */
	async subscribe(
		user: IUser,
		preferredCategories: string[] = []
	): Promise<INewsletter> {
		// Verificar si ya está suscrito
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

		// Convertir categorías a ObjectId
		const categoryIds = preferredCategories.map(
			(catId) => new Types.ObjectId(catId)
		);

		// Crear suscripción
		const newsletter = await this.repository.create({
			user: new Types.ObjectId(user._id),
			email: user.email,
			name: `${user.name} ${user.lastName}`.trim(),
			preferredCategories: categoryIds,
			isActive: true,
		});

		return newsletter;
	}

	/**
	 * Actualizar preferencias de categorías
	 * @param userId - ID del usuario
	 * @param preferredCategories - Nuevas categorías (máx 3)
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

		// Convertir categorías a ObjectId
		const categoryIds = preferredCategories.map(
			(catId) => new Types.ObjectId(catId)
		);

		const updated = await this.repository.updateByUserId(userId, {
			preferredCategories: categoryIds,
		});

		if (!updated) {
			throw new AppError(
				'Error al actualizar preferencias',
				500,
				'NEWSLETTER_UPDATE_ERROR'
			);
		}

		return updated;
	}

	/**
	 * Desuscribir un usuario (marcar como inactivo)
	 * @param userId - ID del usuario
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
	 * Obtener la suscripción propia del usuario
	 * @param userId - ID del usuario
	 */
	async getMySubscription(userId: string): Promise<INewsletter | null> {
		return await this.repository.findByUserId(userId);
	}

	// ============================================
	// MÉTODOS SOLO PARA ADMIN
	// ============================================

	/**
	 * Obtener todos los suscriptores activos
	 * Solo para admin/superadmin
	 */
	async getAllActiveSubscribers(): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribers();
	}

	/**
	 * Buscar suscriptor por ID
	 * Solo para admin/superadmin
	 */
	async getSubscriberById(id: string): Promise<INewsletter | null> {
		return await this.repository.findById(id);
	}

	/**
	 * Buscar suscriptor por email
	 * Solo para admin/superadmin
	 */
	async getSubscriberByEmail(email: string): Promise<INewsletter | null> {
		return await this.repository.findByEmail(email);
	}

	/**
	 * Obtener suscriptores activos por categoría
	 * Solo para admin/superadmin
	 */
	async getSubscribersByCategory(categoryId: string): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribersByCategory(categoryId);
	}
}

export const newsletterService = new NewsletterService();

import { newsletterRepository } from '../repositories/newsletter.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../errors/AppError.js';
import { Types } from 'mongoose';

const userRepository = new UserRepository();

export class NewsletterService {
	private repository = newsletterRepository;

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

	async getMySubscription(userId: string): Promise<INewsletter | null> {
		return await this.repository.findByUserId(userId);
	}

	async getAllActiveSubscribers(): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribers();
	}

	async getSubscriberById(id: string): Promise<INewsletter | null> {
		return await this.repository.findById(id);
	}

	async getSubscriberByEmail(email: string): Promise<INewsletter | null> {
		const user = await userRepository.findByEmail(email);
		if (!user) return null;

		return await this.repository.findByUserId(user._id as string);
	}

	async getSubscribersByCategory(categoryId: string): Promise<INewsletter[]> {
		return await this.repository.findActiveSubscribersByCategory(categoryId);
	}
}

export const newsletterService = new NewsletterService();

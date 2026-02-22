import type { Types } from 'mongoose';

import type { INewsletter } from '../interfaces/newsletter.interface.js';
import Newsletter from '../models/newsletter.model.js';

/**
 * Newsletter repository for database operations.
 * Handles all CRUD operations for Newsletter subscription entities.
 * 
 * @example
 * ```typescript
 * const newsletterRepository = new NewsletterRepository();
 * const subscription = await newsletterRepository.findByUserId(userId);
 * ```
 */
export class NewsletterRepository {
	/**
	 * Finds a newsletter subscription by ID.
	 * @param id - Newsletter subscription ID
	 * @returns Newsletter subscription or null if not found
	 */
	async findById(id: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findById(id)
			.populate('user', 'email name lastName')
			.populate('preferredCategories', 'name')
			.exec();
	}

	/**
	 * Finds a newsletter subscription by user ID.
	 * @param userId - User ID
	 * @returns Newsletter subscription or null if not found
	 */
	async findByUserId(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOne({ user: userId })
			.populate('user', 'email name lastName')
			.populate('preferredCategories', 'name')
			.exec();
	}

	/**
	 * Creates a new newsletter subscription.
	 * @param data - Subscription data
	 * @returns Created subscription
	 */
	async create(data: Partial<INewsletter>): Promise<INewsletter> {
		const newsletter = new Newsletter(data);
		return await newsletter.save();
	}

	/**
	 * Updates a newsletter subscription by user ID.
	 * @param userId - User ID
	 * @param data - Data to update
	 * @returns Updated subscription or null if not found
	 */
	async updateByUserId(
		userId: string | Types.ObjectId,
		data: Partial<INewsletter>
	): Promise<INewsletter | null> {
		return await Newsletter.findOneAndUpdate(
			{ user: userId },
			{ $set: data },
			{ new: true, runValidators: true }
		)
			.populate('user', 'email name lastName')
			.populate('preferredCategories', 'name')
			.exec();
	}

	/**
	 * Deactivates a newsletter subscription.
	 * @param userId - User ID
	 * @returns Updated subscription or null if not found
	 */
	async unsubscribe(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOneAndUpdate(
			{ user: userId },
			{ $set: { isActive: false } },
			{ new: true }
		)
			.populate('user', 'email name lastName')
			.exec();
	}

	/**
	 * Finds all active newsletter subscriptions.
	 * @returns Array of active subscriptions
	 */
	async findActiveSubscribers(): Promise<INewsletter[]> {
		return await Newsletter.find({ isActive: true })
			.populate('user', 'email name lastName')
			.populate('preferredCategories', 'name')
			.exec();
	}

	/**
	 * Finds active subscribers by preferred category.
	 * @param categoryId - Category ID
	 * @returns Array of subscriptions with the category preference
	 */
	async findActiveSubscribersByCategory(categoryId: string | Types.ObjectId): Promise<INewsletter[]> {
		return await Newsletter.find({
			isActive: true,
			preferredCategories: categoryId,
		})
			.populate('user', 'email name lastName')
			.populate('preferredCategories', 'name')
			.exec();
	}
}

export const newsletterRepository = new NewsletterRepository();

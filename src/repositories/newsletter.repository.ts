import Newsletter from '../models/newsletter.model.js';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type { Types } from 'mongoose';

export class NewsletterRepository {
	async findByUserId(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOne({ user: userId });
	}

	async findByEmail(email: string): Promise<INewsletter | null> {
		return await Newsletter.findOne({ email: email.toLowerCase().trim() });
	}

	async create(data: Partial<INewsletter>): Promise<INewsletter> {
		const newsletter = new Newsletter(data);
		return await newsletter.save();
	}

	async updateByUserId(
		userId: string | Types.ObjectId,
		data: Partial<INewsletter>
	): Promise<INewsletter | null> {
		return await Newsletter.findOneAndUpdate(
			{ user: userId },
			{ $set: data },
			{ new: true, runValidators: true }
		);
	}

	async unsubscribe(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOneAndUpdate(
			{ user: userId },
			{ $set: { isActive: false } },
			{ new: true }
		);
	}

	async findActiveSubscribers(): Promise<INewsletter[]> {
		return await Newsletter.find({ isActive: true })
			.populate('user', 'email name')
			.populate('preferredCategories', 'name');
	}

	async findActiveSubscribersByCategory(categoryId: string | Types.ObjectId): Promise<INewsletter[]> {
		return await Newsletter.find({
			isActive: true,
			preferredCategories: categoryId,
		}).populate('user', 'email name');
	}
}

export const newsletterRepository = new NewsletterRepository();

import Newsletter from '../models/newsletter.model.js';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type { Types } from 'mongoose';

export class NewsletterRepository {
	async findById(id: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findById(id).exec();
	}

	async findByUserId(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOne({ user: userId }).exec();
	}

	async findByEmail(email: string): Promise<INewsletter | null> {
		return await Newsletter.findOne({ email: email.toLowerCase().trim() }).exec();
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
		).exec();
	}

	async unsubscribe(userId: string | Types.ObjectId): Promise<INewsletter | null> {
		return await Newsletter.findOneAndUpdate(
			{ user: userId },
			{ $set: { isActive: false } },
			{ new: true }
		).exec();
	}

	async findActiveSubscribers(): Promise<INewsletter[]> {
		return await Newsletter.find({ isActive: true })
			.populate('user', 'email name')
			.populate('preferredCategories', 'name')
			.exec();
	}

	async findActiveSubscribersByCategory(categoryId: string | Types.ObjectId): Promise<INewsletter[]> {
		return await Newsletter.find({
			isActive: true,
			preferredCategories: categoryId,
		})
			.populate('user', 'email name')
			.exec();
	}
}

export const newsletterRepository = new NewsletterRepository();

import mongoose, { Schema } from 'mongoose';
import type { INewsletter } from '../interfaces/newsletter.interface.js';

const NewsletterSchema: Schema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		preferredCategories: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

NewsletterSchema.index({ user: 1 });
NewsletterSchema.index({ email: 1 });

export default (mongoose.models.Newsletter as mongoose.Model<INewsletter>) ||
	mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

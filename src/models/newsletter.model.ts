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

export default (mongoose.models.Newsletter as mongoose.Model<INewsletter>) ||
	mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

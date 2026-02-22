import mongoose, { Schema } from 'mongoose';

import type { ICategory } from '../interfaces/category.interface.js';

/**
 * Mongoose schema for Category entity.
 * Defines the structure and validation for category documents.
 */
const CategorySchema: Schema = new Schema(
	{
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, default: '' },
		isActive: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

export default (mongoose.models.Category as mongoose.Model<ICategory>) ||
	mongoose.model<ICategory>('Category', CategorySchema);

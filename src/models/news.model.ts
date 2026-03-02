import mongoose, { Schema } from 'mongoose';

import type { INews } from '../interfaces/news.interface.js';

/**
 * Mongoose schema for News entity.
 * Defines the structure and validation for news article documents.
 */
const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    highlights: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    mainImage: { type: String },
    source: { type: String },
    variant: {
      type: String,
      enum: ['highlighted', 'featured', 'default'],
      default: 'default',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'approved', 'published', 'rejected'],
      default: 'draft'
    },
    publicationDate: { type: Date, default: null }
  },
  { timestamps: true }
);

export default (mongoose.models.News as mongoose.Model<INews>) ||
  mongoose.model<INews>('News', NewsSchema);
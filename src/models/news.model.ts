import mongoose, { Schema } from 'mongoose';
import type { INews } from '../interfaces/news.interface.ts';

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    highlights: { type: [String], default: [] },
    author: { type: String, required: true },
    category: { type: String, 
      enum: ['politic', 'economy', 'sports', 'technology', 'health', 'entertainment', 'science', 'world', 'local','education', 'travel', 'lifestyle','international'],
      default: 'politic',
      required: true },
    mainImage: { type: String },
    source: { type: String },
    variant : { type: String,
      enum: ['highlighted', 'featured', 'default'],
      default: 'default',
      required: true 
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    publicationDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<INews>('News', NewsSchema);
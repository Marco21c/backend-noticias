import mongoose, { Schema } from 'mongoose';
import type { INews } from '../interfaces/news.interface.js';

const NewsSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    highlights: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    mainImage: { type: String },
    source: { type: String },
    variant : { type: String,
      enum: ['highlighted', 'featured', 'default'],
      default: 'default',
      required: true 
    },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'approved', 'published', 'rejected'],
      default: 'draft'
    },
    publicationDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Índice de texto para búsqueda eficiente y con relevancia
NewsSchema.index({
  title: 'text',
  summary: 'text',
  content: 'text',
  highlights: 'text'
}, {
  weights: {
    title: 10,      // Mayor peso al título
    summary: 5,     // Peso medio al resumen
    content: 1,     // Peso base al contenido
    highlights: 3   // Peso alto a highlights
  },
  name: 'NewsTextIndex'
});

export default mongoose.model<INews>('News', NewsSchema);
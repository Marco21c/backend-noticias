import mongoose, { Schema } from 'mongoose';
import type { INoticia } from '../interfaces/noticia.interface.ts';

const NoticiaSchema: Schema = new Schema(
  {
    titulo: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    copete: { type: String, required: true },
    contenido: { type: String, required: true },
    frasesDestacadas: { type: [String], default: [] },
    autor: { type: String, required: true },
    categoria: { type: String, required: true },
    imagenPrincipal: { type: String },
    fuente: { type: String },
    estado: {
      type: String,
      enum: ['borrador', 'publicada'],
      default: 'borrador'
    },
    fechaPublicacion: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<INoticia>('Noticia', NoticiaSchema);
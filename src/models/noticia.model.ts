
import mongoose, { Schema, Document } from 'mongoose';

export interface INoticia extends Document {
  titulo: string;
  slug: string;
  copete: string;
  contenido: string;
  frasesDestacadas: string[];
  autor: string;
  categoria: string;
  imagenPrincipal?: string;
  fuente?: string;
  estado: 'borrador' | 'publicada';
  fechaPublicacion: Date;
}

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
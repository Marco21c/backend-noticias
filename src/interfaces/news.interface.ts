import { type Types } from "mongoose";

/**
 * Interfaz que representa una Noticia en el sistema.
 * Define la estructura de datos para las publicaciones de noticias.
 */
export interface INews {
  /** Identificador único de la noticia */
  _id?: string;
  /** Título de la noticia */
  title: string;
  /** Identificador URL-friendly único */
  slug: string;
  /** Resumen breve del contenido */
  summary: string;
  /** Contenido completo de la noticia */
  content: string;
  /** Puntos destacados o bullets importantes */
  highlights: string[];
  /** Referencia al autor de la noticia */
  author: Types.ObjectId | string;
  /** Referencia a la categoría de la noticia */
  category: Types.ObjectId | string;
  /** URL de la imagen principal */
  mainImage?: string;
  /** Fuente de la noticia (si aplica) */
  source?: string;
  /** Variante de visualización: destacada, destacada principal o por defecto */
  variant: 'highlighted' | 'featured' | 'default';
  /** Estado del flujo editorial */
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'rejected';
  /** Fecha de publicación programada */
  publicationDate?: Date | null;
  /** Fecha de creación del registro */
  createdAt?: Date;
  /** Fecha de última actualización */
  updatedAt?: Date;
}

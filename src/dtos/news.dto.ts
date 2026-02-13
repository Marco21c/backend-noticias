import type { INews } from '../interfaces/news.interface.js';
import type {
  CreateNewsInput,
  UpdateNewsInput,
  NewsQuery,
  NewsIdParam,
  NewsByCategoryQuery
} from '../validations/news.schemas.js';

export type CreateNewsRequestDto = CreateNewsInput;
export type UpdateNewsRequestDto = UpdateNewsInput;
export type NewsQueryRequestDto = NewsQuery;
export type NewsIdRequestDto = NewsIdParam;
export type NewsByCategoryRequestDto = NewsByCategoryQuery;

export type NewsReferenceDto = {
  id?: string;
  name?: string;
};

export type NewsResponseDto = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  highlights: string[];
  author: NewsReferenceDto;
  category: NewsReferenceDto;
  mainImage?: string;
  source?: string;
  variant: INews['variant'];
  status: INews['status'];
  publicationDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NewsPublicResponseDto = Omit<NewsResponseDto, 'author'> & {
  author: { name: string | undefined };
};

function normalizeRef(ref: any): NewsReferenceDto {
  if (!ref) return {};
  if (typeof ref === 'string') return { id: ref };

  const id = ref._id ?? ref.id;
  const name = ref.name;

  return {
    ...(id ? { id: String(id) } : {}),
    ...(name ? { name: String(name) } : {})
  };
}

export function toNewsResponseDto(news: INews | any): NewsResponseDto {
  const obj = news?.toObject ? news.toObject() : news;

  return {
    id: String(obj._id ?? obj.id),
    title: obj.title,
    slug: obj.slug,
    summary: obj.summary,
    content: obj.content,
    highlights: Array.isArray(obj.highlights) ? obj.highlights : [],
    author: normalizeRef(obj.author),
    category: normalizeRef(obj.category),
    mainImage: obj.mainImage,
    source: obj.source,
    variant: obj.variant,
    status: obj.status,
    publicationDate: obj.publicationDate ?? null,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
}

/**
 * Mapper para DTO público (sin author.id)
 */
export function toNewsPublicResponseDto(news: INews | any): NewsPublicResponseDto {
  const obj = news?.toObject ? news.toObject() : news;
  const authorRef = normalizeRef(obj.author);

  return {
    id: String(obj._id ?? obj.id),
    title: obj.title,
    slug: obj.slug,
    summary: obj.summary,
    content: obj.content,
    highlights: Array.isArray(obj.highlights) ? obj.highlights : [],
    author: { name: authorRef.name }, // Solo nombre, sin ID
    category: normalizeRef(obj.category),
    mainImage: obj.mainImage,
    source: obj.source,
    variant: obj.variant,
    status: obj.status,
    publicationDate: obj.publicationDate ?? null,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
}

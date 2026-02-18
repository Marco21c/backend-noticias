import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type {
	SubscribeInput,
	UpdatePreferencesInput,
	NewsletterIdParam,
	NewsletterEmailParam,
	NewsletterCategoryParam,
} from '../validations/newsletter.schemas.js';

// Request DTOs (alias de tipos Zod)
export type SubscribeRequestDto = SubscribeInput;
export type UpdatePreferencesRequestDto = UpdatePreferencesInput;
export type NewsletterIdRequestDto = NewsletterIdParam;
export type NewsletterEmailRequestDto = NewsletterEmailParam;
export type NewsletterCategoryRequestDto = NewsletterCategoryParam;

// Response DTOs
export type NewsletterResponseDto = {
	id: string;
	user: string;
	email: string;
	name: string;
	preferredCategories: string[];
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
};

export type NewsletterSubscriberDto = {
	id: string;
	email: string;
	name: string;
	preferredCategories: Array<{
		id: string;
		name: string;
	}>;
	isActive: boolean;
	createdAt?: Date;
};

function normalizeId(id: unknown): string {
	return id ? String(id) : '';
}

export function toNewsletterResponseDto(newsletter: INewsletter | any): NewsletterResponseDto {
	const obj = newsletter?.toObject ? newsletter.toObject() : newsletter;

	return {
		id: normalizeId(obj._id ?? obj.id),
		user: normalizeId(obj.user),
		email: obj.email,
		name: obj.name,
		preferredCategories: Array.isArray(obj.preferredCategories)
			? obj.preferredCategories.map((cat: any) =>
					typeof cat === 'string' ? cat : normalizeId(cat._id ?? cat.id)
			  )
			: [],
		isActive: obj.isActive ?? true,
		createdAt: obj.createdAt,
		updatedAt: obj.updatedAt,
	};
}

export function toNewsletterSubscriberDto(newsletter: INewsletter | any): NewsletterSubscriberDto {
	const obj = newsletter?.toObject ? newsletter.toObject() : newsletter;

	// Procesar categorías populadas
	const categories = Array.isArray(obj.preferredCategories)
		? obj.preferredCategories.map((cat: any) => ({
				id: typeof cat === 'string' ? cat : normalizeId(cat._id ?? cat.id),
				name: typeof cat === 'string' ? '' : cat.name ?? '',
		  }))
		: [];

	return {
		id: normalizeId(obj._id ?? obj.id),
		email: obj.email,
		name: obj.name,
		preferredCategories: categories,
		isActive: obj.isActive ?? true,
		createdAt: obj.createdAt,
	};
}

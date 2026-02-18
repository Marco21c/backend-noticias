import { Types } from 'mongoose';
import type { INewsletter } from '../interfaces/newsletter.interface.js';
import type {
	SubscribeInput,
	UpdatePreferencesInput,
	NewsletterIdParam,
	NewsletterEmailParam,
	NewsletterCategoryParam,
} from '../validations/newsletter.schemas.js';

type PopulatedCategory = {
	_id: Types.ObjectId | string;
	name: string;
};

type NewsletterPlainObject = {
	_id?: Types.ObjectId | string;
	user: Types.ObjectId | string;
	email: string;
	name: string;
	preferredCategories?: (Types.ObjectId | string | PopulatedCategory)[];
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
};

export type SubscribeRequestDto = SubscribeInput;
export type UpdatePreferencesRequestDto = UpdatePreferencesInput;
export type NewsletterIdRequestDto = NewsletterIdParam;
export type NewsletterEmailRequestDto = NewsletterEmailParam;
export type NewsletterCategoryRequestDto = NewsletterCategoryParam;

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

function normalizeId(id: Types.ObjectId | string | undefined): string {
	if (!id) return '';
	return id instanceof Types.ObjectId ? id.toString() : String(id);
}

function toPlainObject(
	newsletter: INewsletter | { toObject: () => NewsletterPlainObject }
): NewsletterPlainObject {
	if ('toObject' in newsletter) {
		return newsletter.toObject();
	}
	return newsletter as NewsletterPlainObject;
}

export function toNewsletterResponseDto(
	newsletter: INewsletter | { toObject: () => NewsletterPlainObject }
): NewsletterResponseDto {
	const obj = toPlainObject(newsletter);

	const response: NewsletterResponseDto = {
		id: normalizeId(obj._id),
		user: normalizeId(obj.user),
		email: obj.email,
		name: obj.name,
		preferredCategories: Array.isArray(obj.preferredCategories)
			? obj.preferredCategories.map((cat) => {
					if (typeof cat === 'string') return cat;
					if (cat instanceof Types.ObjectId) return cat.toString();
					return normalizeId(cat._id);
				})
			: [],
		isActive: obj.isActive ?? true,
	};

	if (obj.createdAt) response.createdAt = obj.createdAt;
	if (obj.updatedAt) response.updatedAt = obj.updatedAt;

	return response;
}

export function toNewsletterSubscriberDto(
	newsletter: INewsletter | { toObject: () => NewsletterPlainObject }
): NewsletterSubscriberDto {
	const obj = toPlainObject(newsletter);

	const categories = Array.isArray(obj.preferredCategories)
		? obj.preferredCategories.map((cat) => {
				if (typeof cat === 'string') {
					return { id: cat, name: '' };
				}
				if (cat instanceof Types.ObjectId) {
					return { id: cat.toString(), name: '' };
				}
				return {
					id: normalizeId(cat._id),
					name: cat.name ?? '',
				};
			})
		: [];

	const response: NewsletterSubscriberDto = {
		id: normalizeId(obj._id),
		email: obj.email,
		name: obj.name,
		preferredCategories: categories,
		isActive: obj.isActive ?? true,
	};

	if (obj.createdAt) response.createdAt = obj.createdAt;

	return response;
}

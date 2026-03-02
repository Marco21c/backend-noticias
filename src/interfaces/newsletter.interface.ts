import type { Types } from 'mongoose';

/**
 * Newsletter subscription interface.
 * Represents a user's newsletter subscription with category preferences.
 */
export interface INewsletter {
	_id?: string;
	user: Types.ObjectId | string;
	preferredCategories: Types.ObjectId[] | string[];
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

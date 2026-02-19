import type { Types } from 'mongoose';

export interface INewsletter {
	_id?: string;
	user: Types.ObjectId | string;
	preferredCategories: Types.ObjectId[] | string[];
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

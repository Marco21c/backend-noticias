import type { Types } from 'mongoose';

export interface INewsletter {
	_id?: string;
	user: Types.ObjectId | string;
	email: string;
	name: string;
	preferredCategories: Types.ObjectId[] | string[];
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

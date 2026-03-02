/**
 * Category entity interface.
 * Represents a news category for organizing articles.
 */
export interface ICategory {
	_id?: string;
	name: string;
	description?: string;
	isActive: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

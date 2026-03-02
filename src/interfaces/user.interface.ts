/**
 * User entity interface.
 * Represents a user in the system with authentication and role information.
 */
export interface IUser {
	_id?: string;
	email: string;
	password: string;
	role: 'superadmin' | 'admin' | 'editor' | 'user';
	name: string;
	lastName: string;
	createdAt?: Date;
	updatedAt?: Date;
}

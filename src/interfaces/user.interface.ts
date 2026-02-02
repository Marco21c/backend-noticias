export interface IUser {
	_id?: string;
	email: string;
	password: string;
	role: 'admin' | 'editor' | 'user';
	name: string;
    lastName:string;
	createdAt?: Date;
	updatedAt?: Date;
}

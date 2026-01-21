import type { IUser } from '../interfaces/user.interface.js';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export class UserService {

    
	async getAllUsers(): Promise<IUser[]> {
		return UserModel.find().select('-password').exec();
	}

	async getUserById(id: string): Promise<IUser | null> {
		return UserModel.findById(id).select('-password').exec();
	}

	async getUserByEmail(email: string): Promise<IUser | null> {
		return UserModel.findOne({ email }).exec();
	}

	async createUser(userData: Partial<IUser> & { password: string }): Promise<IUser> {
		const { password, ...rest } = userData;
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);
		const newUser = new UserModel({ ...rest, password: hashed });
		return newUser.save();
	}

	async updateUser(id: string, updateData: Partial<IUser> & { password?: string }): Promise<IUser | null> {
		const data: any = { ...updateData };
		if (updateData.password) {
			const salt = await bcrypt.genSalt(10);
			data.password = await bcrypt.hash(updateData.password, salt);
		}
		return UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
	}

	async deleteUser(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}
}

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

		// Validadores
		const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

		const email = (rest as any).email;
		if (!email || typeof email !== 'string' || !emailFormat.test(email)) {
			throw new Error('INVALID_EMAIL');
		}

		if (!password || typeof password !== 'string' || !passwordStrong.test(password)) {
			throw new Error('INVALID_PASSWORD');
		}

	
		{
			const escaped = String(email).replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
			const emailRegex = new RegExp('^' + escaped + '$', 'i');
			const existing = await UserModel.findOne({ email: { $regex: emailRegex } }).exec();
			if (existing) throw new Error('EMAIL_DUPLICATE');
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);
		const newUser = new UserModel({ ...rest, password: hashed });
		const saved = await newUser.save();
		const obj = (saved as any).toObject ? (saved as any).toObject() : saved;
		delete obj.password;
		return obj;
	}

	async updateUser(id: string, updateData: Partial<IUser> & { password?: string }): Promise<IUser | null> {
		const data: any = { ...updateData };

		const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

		if (updateData.email) {
			const email = String(updateData.email);
			if (!emailFormat.test(email)) throw new Error('INVALID_EMAIL');

			const escaped = email.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
			const emailRegex = new RegExp('^' + escaped + '$', 'i');
			const existing = await UserModel.findOne({ email: { $regex: emailRegex } }).exec();
			if (existing && existing._id.toString() !== id) throw new Error('EMAIL_DUPLICATE');
			data.email = email;
		}

	
		if (updateData.password) {
			if (!passwordStrong.test(updateData.password)) throw new Error('INVALID_PASSWORD');
			const salt = await bcrypt.genSalt(10);
			data.password = await bcrypt.hash(updateData.password, salt);
		}

		const updated = await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
		if (!updated) return null;
		const obj = (updated as any).toObject ? (updated as any).toObject() : updated;
		delete obj.password;
		return obj;
	}

	async deleteUser(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}
}

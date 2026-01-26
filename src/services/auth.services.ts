import type { IUser } from '../interfaces/user.interface.js';
import type { Login } from '../interfaces/login.interface.js';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export class AuthService {

	async login(loginData: Login): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
		const { email, password } = loginData;
		const user = await UserModel.findOne({ email }).exec();
		if (!user) throw new Error('Credenciales inválidas');

		const match = await bcrypt.compare(password, user.password);
		if (!match) throw new Error('Credenciales inválidas');

		const token = this.signToken({
			id: user._id,
	        role: user.role,
			email: user.email,
			name: user.name,
			lastName: user.lastName

		});
		const userObj = user.toObject();
		delete (userObj as any).password;
		return { user: userObj, token };
	}

	signToken(payload: object): string {

    const secret: string = env.JWT_SECRET || 'change_this_secret_in_env';
	
    const expiresIn = (env.JWT_EXPIRES_IN || '7d') as any;

    return jwt.sign(payload, secret, { expiresIn });

    }
	verifyToken(token: string): jwt.JwtPayload | string {
		const secret = env.JWT_SECRET ?? 'change_this_secret_in_env';
		return jwt.verify(token, secret);
	}

	async getUserFromToken(token: string): Promise<Omit<IUser, 'password'> | null> {
		try {
			const decoded = this.verifyToken(token) as any;
			const id = decoded?.id || decoded?._id;
			if (!id) return null;
			return UserModel.findById(id).select('-password').exec();
		} catch (err) {
			return null;
		}
	}
}

export default new AuthService();


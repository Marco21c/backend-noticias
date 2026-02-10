import type { IUser } from '../interfaces/user.interface.js';
import type { Login } from '../interfaces/login.interface.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * AuthService - Capa de lógica de negocio para autenticación
 * Responsabilidad: Lógica de autenticación, JWT, validación de credenciales
 * Independiente de Express
 */
export class AuthService {
	private userRepository: UserRepository;

	constructor(userRepository?: UserRepository) {
		this.userRepository = userRepository || new UserRepository();
	}

	/**
	 * Autenticar usuario y generar JWT
	 */
	async login(loginData: Login): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
		const { email, password } = loginData;
		
		// Buscar usuario por email
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			throw new Error('Credenciales inválidas');
		}

		// Verificar password
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			throw new Error('Credenciales inválidas');
		}

		// Generar token JWT
		const token = this.signToken({
			id: user._id,
			role: user.role,
			email: user.email,
			name: user.name,
			lastName: user.lastName
		});

		// Retornar usuario sin password
		const userObj = (user as any).toObject ? (user as any).toObject() : user;
		delete (userObj as any).password;

		return { user: userObj, token };
	}

	/**
	 * Firmar token JWT
	 */
	signToken(payload: object): string {
		const secret: string = env.JWT_SECRET || 'change_this_secret_in_env';
		const expiresIn = (env.JWT_EXPIRES_IN || '7d') as any;
		return jwt.sign(payload, secret, { expiresIn });
	}

	/**
	 * Verificar token JWT
	 */
	verifyToken(token: string): jwt.JwtPayload | string {
		const secret = env.JWT_SECRET ?? 'change_this_secret_in_env';
		return jwt.verify(token, secret);
	}

	/**
	 * Obtener usuario desde token JWT
	 */
	async getUserFromToken(token: string): Promise<Omit<IUser, 'password'> | null> {
		try {
			const decoded = this.verifyToken(token) as any;
			const id = decoded?.id || decoded?._id;
			if (!id) return null;
			
			return this.userRepository.findById(id, '-password');
		} catch (err) {
			return null;
		}
	}
}

export default new AuthService();


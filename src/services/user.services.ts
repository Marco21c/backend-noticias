import type { IUser } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';

/**
 * UserService - Capa de lógica de negocio para Users
 * Responsabilidad: Validaciones, reglas de negocio, transformaciones
 */
export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository?: UserRepository) {
		this.userRepository = userRepository || new UserRepository();
	}

	/**
	 * Obtener todos los usuarios (sin password)
	 */
	async getAllUsers(): Promise<IUser[]> {
		return this.userRepository.findAll('-password');
	}

	/**
	 * Obtener usuario por ID (sin password)
	 */
	async getUserById(id: string): Promise<IUser | null> {
		return this.userRepository.findById(id, '-password');
	}

	/**
	 * Obtener usuario por email (con password)
	 */
	async getUserByEmail(email: string): Promise<IUser | null> {
		return this.userRepository.findByEmail(email);
	}

	/**
	 * Crear un nuevo usuario
	 * Aplica validaciones de negocio y hasheo de password
	 */
	async createUser(userData: Partial<IUser> & { password: string }): Promise<IUser> {
		const { password, ...rest } = userData;

		// 🔒 REGLA DE NEGOCIO: Bloquear creación de superadmin desde la API
		if ((rest as any).role === 'superadmin') {
			throw new Error('FORBIDDEN_ROLE');
		}

		// Validaciones de formato
		this.validateEmail((rest as any).email);
		this.validatePassword(password);

		// Verificar email duplicado
		const emailExists = await this.userRepository.emailExists((rest as any).email);
		if (emailExists) {
			throw new Error('EMAIL_DUPLICATE');
		}

		// Hashear password
		const hashedPassword = await this.hashPassword(password);

		// Crear usuario
		const newUser = await this.userRepository.create({ ...rest, password: hashedPassword });
		
		// Retornar sin password
		return this.sanitizeUser(newUser);
	}

	/**
	 * Actualizar un usuario existente
	 * Aplica validaciones y hasheo de password si es necesario
	 */
	async updateUser(id: string, updateData: Partial<IUser> & { password?: string }): Promise<IUser | null> {
		const data: any = { ...updateData };

		// 🔒 REGLA DE NEGOCIO: Bloquear cambio a rol superadmin desde la API
		if (updateData?.role === 'superadmin') {
			throw new Error('FORBIDDEN_ROLE');
		}

		// Validar email si se está actualizando
		if (updateData.email) {
			this.validateEmail(updateData.email);
			
			// Verificar email duplicado (excluyendo el usuario actual)
			const emailExists = await this.userRepository.emailExists(updateData.email, id);
			if (emailExists) {
				throw new Error('EMAIL_DUPLICATE');
			}
			data.email = updateData.email;
		}

		// Validar y hashear password si se está actualizando
		if (updateData.password) {
			this.validatePassword(updateData.password);
			data.password = await this.hashPassword(updateData.password);
		}

		// Actualizar usuario
		const updated = await this.userRepository.update(id, data);
		if (!updated) return null;

		// Retornar sin password
		return this.sanitizeUser(updated);
	}

	/**
	 * Eliminar un usuario
	 */
	async deleteUser(id: string): Promise<IUser | null> {
		return this.userRepository.delete(id);
	}

	// ========== Métodos privados de validación ==========

	/**
	 * Validar formato de email
	 */
	private validateEmail(email: string): void {
		const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || typeof email !== 'string' || !emailFormat.test(email)) {
			throw new Error('INVALID_EMAIL');
		}
	}

	/**
	 * Validar fortaleza de password
	 */
	private validatePassword(password: string): void {
		const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
		if (!password || typeof password !== 'string' || !passwordStrong.test(password)) {
			throw new Error('INVALID_PASSWORD');
		}
	}

	/**
	 * Hashear password
	 */
	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	/**
	 * Eliminar campos sensibles del usuario
	 */
	private sanitizeUser(user: any): IUser {
		const obj = user.toObject ? user.toObject() : user;
		delete obj.password;
		return obj;
	}
}

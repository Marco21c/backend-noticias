import type { IUser } from '../interfaces/user.interface.js';
import UserModel from '../models/user.model.js';

/**
 * UserRepository - Capa de acceso a datos para Users
 * Responsabilidad: Solo operaciones CRUD con la base de datos
 */
export class UserRepository {
	/**
	 * Obtener todos los usuarios
	 */
	async findAll(selectFields?: string): Promise<IUser[]> {
		const query = UserModel.find();
		if (selectFields) {
			query.select(selectFields);
		}
		return query.exec();
	}

	/**
	 * Buscar usuario por ID
	 */
	async findById(id: string, selectFields?: string): Promise<IUser | null> {
		const query = UserModel.findById(id);
		if (selectFields) {
			query.select(selectFields);
		}
		return query.exec();
	}

	/**
	 * Buscar usuario por email
	 */
	async findByEmail(email: string): Promise<IUser | null> {
		return UserModel.findOne({ email }).exec();
	}

	/**
	 * Buscar usuario por email con regex (case insensitive)
	 */
	async findByEmailRegex(emailRegex: RegExp): Promise<IUser | null> {
		return UserModel.findOne({ email: { $regex: emailRegex } }).exec();
	}

	/**
	 * Crear un nuevo usuario
	 */
	async create(userData: Partial<IUser>): Promise<IUser> {
		const user = new UserModel(userData);
		return user.save();
	}

	/**
	 * Actualizar un usuario existente
	 */
	async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
		return UserModel.findByIdAndUpdate(id, userData, { new: true }).exec();
	}

	/**
	 * Eliminar un usuario
	 */
	async delete(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}

	/**
	 * Verificar si un email ya existe (case insensitive)
	 */
	async emailExists(email: string, excludeId?: string): Promise<boolean> {
		const escaped = String(email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const emailRegex = new RegExp('^' + escaped + '$', 'i');
		const existing = await UserModel.findOne({ email: { $regex: emailRegex } }).exec();
		
		if (!existing) return false;
		if (excludeId && existing._id.toString() === excludeId) return false;
		return true;
	}
}

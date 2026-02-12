import type { IUser } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import type { CreateUserInput, UpdateUserInput } from '../validations/user.schemas.js';
import { sanitizeUser } from '../helpers/sanitizeUser.js';

/**
 * UserService - Capa de lógica de negocio para Users
 * Responsabilidad: Reglas de negocio, transformaciones, operaciones complejas
 * NO valida formatos (eso lo hace Zod en el middleware)
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
     * Obtener usuario por email (con password para autenticación)
     */
    async getUserByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findByEmail(email);
    }

    /**
     * Crear un nuevo usuario
     * @param userData - Datos validados por Zod (futuro: CreateUserDto)
     * Aplica reglas de negocio: bloqueo de superadmin, email único, hasheo
     */
    async createUser(userData: CreateUserInput): Promise<IUser> {
        const { password, role, email, ...rest } = userData;

        // REGLA DE NEGOCIO: Email único
        const emailExists = await this.userRepository.emailExists(email);
        if (emailExists) {
            throw new Error('EMAIL_DUPLICATE');
        }

        // Hashear password
        const hashedPassword = await this.hashPassword(password);

        // Crear usuario
        const newUser = await this.userRepository.create({
            ...rest,
            email,
            role,
            password: hashedPassword
        });

        // Retornar sin password
        return sanitizeUser(newUser);
    }

    /**
     * Actualizar un usuario existente
     * @param id - ID del usuario a actualizar
     * @param updateData - Datos validados por Zod (futuro: UpdateUserDto)
     * Aplica reglas de negocio: bloqueo de superadmin, email único
     */
    async updateUser(id: string, updateData: UpdateUserInput): Promise<IUser | null> {
        const { password, role, email, ...rest } = updateData;

        const dataToUpdate: any = { ...rest };

        // REGLA DE NEGOCIO: Email único (si se está actualizando)
        if (email) {
            const emailExists = await this.userRepository.emailExists(email, id);
            if (emailExists) {
                throw new Error('EMAIL_DUPLICATE');
            }
            dataToUpdate.email = email;
        }

        // Agregar role si existe
        if (role) {
            dataToUpdate.role = role;
        }

        // Hashear password si se está actualizando
        if (password) {
            dataToUpdate.password = await this.hashPassword(password);
        }

        // Actualizar usuario
        const updated = await this.userRepository.update(id, dataToUpdate);
        if (!updated) return null;

        // Retornar sin password
        return sanitizeUser(updated);
    }

    /**
     * Eliminar un usuario
     */
    async deleteUser(id: string): Promise<IUser | null> {
        return this.userRepository.delete(id);
    }

    // ========== Métodos privados ==========

    /**
     * Hashear password con bcrypt
     */
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

}
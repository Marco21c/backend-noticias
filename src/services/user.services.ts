import bcrypt from 'bcryptjs';

import type { CreateUserRequestDto, UpdateUserRequestDto } from '../dtos/user.dto.js';
import { sanitizeUser } from '../helpers/sanitizeUser.js';
import type { IPaginationOptions, IPaginatedResponse } from '../interfaces/pagination.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';

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
     * Obtiene el listado completo de todos los usuarios registrados activos.
     * Retorna la información sanitizada (sin el password).
     * 
     * @returns {Promise<IUser[]>} Arreglo con todos los usuarios.
     */
    async getAllUsers(): Promise<IUser[]> {
        return this.userRepository.findAll('-password');
    }

    /**
     * Obtiene los usuarios de forma paginada para listar eficientemente.
     * 
     * @param {IPaginationOptions} options Limit, sort, u offsets de mongo.
     * @returns {Promise<IPaginatedResponse<IUser>>} Objeto de paginación de usuarios
     */
    async getUsersPaginated(
        options: IPaginationOptions
    ): Promise<IPaginatedResponse<IUser>> {
        return this.userRepository.findAllPaginated(options, '-password');
    }

    /**
     * Extrae un usuario de base de datos directamente por ID ignorando el hash.
     * 
     * @param {string} id ID unico que identifica a un usuario en Mongo.
     * @returns {Promise<IUser | null>} Usuario u objeto nulo si no existe
     */
    async getUserById(id: string): Promise<IUser | null> {
        return this.userRepository.findById(id, '-password');
    }

    /**
     * Busca a un empleado / lector por email para el primer paso del login.
     * (Retorna un Iuser CON el password expuesto listo para ser comparado).
     * 
     * @param {string} email El email del usuario entrante
     * @returns {Promise<IUser | null>}
     */
    async getUserByEmail(email: string): Promise<IUser | null> {
        return this.userRepository.findByEmail(email);
    }

    /**
     * Crea un nuevo usuario validando existencia y reglas de roles.
     * 
     * @param {CreateUserRequestDto} userData DTO (generalmente de endpoint HTTP) con el body limipio de la creación.
     * @throws {Error} FORBIDDEN_ROLE si el usuario pide crearse como superadmin
     * @throws {Error} EMAIL_DUPLICATE si ya existe alguien con este correo
     * @returns {Promise<IUser>} Nuevo usuario creado.
     */
    async createUser(userData: CreateUserRequestDto): Promise<IUser> {
        const { password, role, email, ...rest } = userData;

        if (role === 'superadmin') {
            throw new Error('FORBIDDEN_ROLE');
        }

        const emailExists = await this.userRepository.emailExists(email);
        if (emailExists) {
            throw new Error('EMAIL_DUPLICATE');
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.userRepository.create({
            ...rest,
            email,
            role,
            password: hashedPassword
        });

        return sanitizeUser(newUser);
    }

    /**
     * Actualiza información referencial de un usuario por su Mongo ID.
     * 
     * @param {string} id Referencia mongo `_id` de este usuario
     * @param {UpdateUserRequestDto} updateData Object de validaciones Parcial (Zod)
     * @throws {Error} EMAIL_DUPLICATE en update o FORBIDDEN_ROLE si lo pide a superadmin
     * @returns {Promise<IUser | null>} Objeto nuevo sanitizado.
     */
    async updateUser(id: string, updateData: UpdateUserRequestDto): Promise<IUser | null> {
        const { password, role, email, ...rest } = updateData;

        const dataToUpdate: Record<string, unknown> = {};

        if (rest.name !== undefined) dataToUpdate.name = rest.name;
        if (rest.lastName !== undefined) dataToUpdate.lastName = rest.lastName;

        if (email) {
            const emailExists = await this.userRepository.emailExists(email, id);
            if (emailExists) {
                throw new Error('EMAIL_DUPLICATE');
            }
            dataToUpdate.email = email;
        }

        if (role) {
            if (role === 'superadmin') {
                throw new Error('FORBIDDEN_ROLE');
            }
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
     * Baja permanente del sistema.
     * 
     * @param {string} id ID unico del target en DB
     * @returns {Promise<IUser | null>}
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
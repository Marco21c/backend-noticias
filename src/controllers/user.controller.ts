import type { Request, Response } from 'express';

import { successResponse } from '../dtos/response.dto.js';
import type {
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserIdRequestDto,
    UserEmailRequestDto,
    PaginationRequestDto
} from '../dtos/user.dto.js';
import { toUserResponseDto } from '../dtos/user.dto.js';
import { AppError } from '../errors/AppError.js';
import { UserService } from '../services/user.services.js';

/**
 * UserController - Capa de presentación/API
 * Responsabilidad: Orquestar requests/responses HTTP
 * Confía en validaciones de Zod hechas en middleware
 */
export class UserController {
    private userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService || new UserService();

        this.getUsers = this.getUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    /**
     * @route GET /api/user
     * @description Obtiene todos los usuarios paginados del sistema.
     * @returns {Promise<Response>} 200 - Lista paginada de Usuarios DTO
     */
    async getUsers(req: Request, res: Response): Promise<Response> {
        const query = res.locals.validated?.query as PaginationRequestDto | undefined;
        const result = await this.userService.getUsersPaginated({
            page: query?.page || 1,
            limit: query?.limit || 10
        });
        const payload = {
            items: result.results.map(toUserResponseDto),
            pagination: {
                total: result.total,
                page: result.page,
                limit: query?.limit || 10,
                totalPages: result.totalPages
            }
        };
        return res.status(200).json(successResponse(payload));
    }

    /**
     * @route POST /api/user
     * @description Crea un nuevo usuario validando existencia por email.
     * @throws {AppError} 403 - FORBIDDEN_ROLE
     * @throws {AppError} 409 - EMAIL_DUPLICATE
     * @returns {Promise<Response>} 201 - Usuario DTO recién creado
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        const userData = res.locals.validated.body as CreateUserRequestDto;

        try {
            const newUser = await this.userService.createUser(userData);
            const payload = toUserResponseDto(newUser);
            return res
                .status(201)
                .json(successResponse(payload, 'Usuario creado correctamente'));
        } catch (error: any) {
            // Mapeo de errores de negocio a HTTP
            if (error?.message === 'FORBIDDEN_ROLE') {
                throw new AppError(
                    'No se puede crear usuarios con rol superadmin',
                    403,
                    'FORBIDDEN_ROLE'
                );
            }
            if (error?.message === 'EMAIL_DUPLICATE') {
                throw new AppError('El email ya existe', 409, 'EMAIL_DUPLICATE');
            }
            throw error;
        }
    }

    /**
     * @route GET /api/user/:id
     * @description Obtiene el modelo de un usuario específico.
     * @throws {AppError} 404 - USER_NOT_FOUND
     * @returns {Promise<Response>} 200 - Usuario DTO.
     */
    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as UserIdRequestDto;
        
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toUserResponseDto(user)));
    }

    /**
     * @route GET /api/user/email
     * @description Busca un usuario utilizando el mail.
     * @throws {AppError} 404 - USER_NOT_FOUND
     * @returns {Promise<Response>} 200 - Usuario DTO.
     */
    async getUserByEmail(req: Request, res: Response): Promise<Response> {
        const { email } = res.locals.validated.query as UserEmailRequestDto;
        
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toUserResponseDto(user)));
    }

    /**
     * @route PUT /api/user/:id
     * @description Actualiza roles, passwords u otros datos del usuario.
     * @throws {AppError} 404 - USER_NOT_FOUND
     * @throws {AppError} 403 - FORBIDDEN_ROLE
     * @throws {AppError} 409 - EMAIL_DUPLICATE
     * @returns {Promise<Response>} 200 - Usuario actualizado DTO
     */
    async editUser(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as UserIdRequestDto;
        const userData = res.locals.validated.body as UpdateUserRequestDto;

        try {
            const edited = await this.userService.updateUser(id, userData);
            if (!edited) {
                throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
            }

            const payload = toUserResponseDto(edited);
            return res
                .status(200)
                .json(successResponse(payload, 'Usuario editado correctamente'));
        } catch (error: any) {
            // Mapeo de errores de negocio a HTTP
            if (error?.message === 'FORBIDDEN_ROLE') {
                throw new AppError(
                    'No se puede asignar rol superadmin', 
                    403, 
                    'FORBIDDEN_ROLE'
                );
            }
            if (error?.message === 'EMAIL_DUPLICATE') {
                throw new AppError('El email ya existe', 409, 'EMAIL_DUPLICATE');
            }
            throw error;
        }
    }

    /**
     * @route DELETE /api/user/:id
     * @description Borrado permanente de usuario.
     * @throws {AppError} 404 - USER_NOT_FOUND
     * @returns {Promise<Response>} 200 - Usuario eliminado DTO.
     */
    async deleteUser(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as UserIdRequestDto;
        
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        const payload = toUserResponseDto(deletedUser);
        return res
            .status(200)
            .json(successResponse(payload, 'Usuario eliminado correctamente'));
    }
}

export const userController = new UserController();
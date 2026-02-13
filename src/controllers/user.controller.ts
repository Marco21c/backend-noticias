import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services.js';
import { AppError } from '../errors/AppError.js';
import type {
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserIdRequestDto,
    UserEmailRequestDto
} from '../dtos/user.dto.js';
import { toUserResponseDto } from '../dtos/user.dto.js';
import { successResponse } from '../dtos/response.dto.js';

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

    async getUsers(_req: Request, res: Response): Promise<Response> {
        const users = await this.userService.getAllUsers();
        const payload = users.map(toUserResponseDto);
        return res.status(200).json(successResponse(payload));
    }

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

    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as UserIdRequestDto;
        
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toUserResponseDto(user)));
    }

    async getUserByEmail(req: Request, res: Response): Promise<Response> {
        const { email } = res.locals.validated.query as UserEmailRequestDto;
        
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toUserResponseDto(user)));
    }

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
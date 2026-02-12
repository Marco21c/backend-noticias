import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services.js';
import { AppError } from '../errors/AppError.js';
import type { 
    CreateUserInput, 
    UpdateUserInput, 
    UserIdParam,
    UserEmailQuery 
} from '../validations/user.schemas.js';

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
        return res.status(200).json(users);
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        const userData = res.locals.validated.body as CreateUserInput;

        try {
            const newUser = await this.userService.createUser(userData);
            return res.status(201).json({ 
                message: 'Usuario creado correctamente', 
                data: newUser 
            });
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
        const { id } = res.locals.validated.params as UserIdParam;
        
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(user);
    }

    async getUserByEmail(req: Request, res: Response): Promise<Response> {
        const { email } = res.locals.validated.query as UserEmailQuery;
        
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json(user);
    }

    async editUser(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as UserIdParam;
        const userData = res.locals.validated.body as UpdateUserInput;

        try {
            const edited = await this.userService.updateUser(id, userData);
            if (!edited) {
                throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
            }

            return res.status(200).json({ 
                message: 'Usuario editado correctamente', 
                data: edited 
            });
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
        const { id } = res.locals.validated.params as UserIdParam;
        
        const deletedUser = await this.userService.deleteUser(id);
        if (!deletedUser) {
            throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
        }

        return res.status(200).json({ 
            message: 'Usuario eliminado correctamente', 
            data: deletedUser 
        });
    }
}

export const userController = new UserController();
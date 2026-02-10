import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.services.js';
import { AppError } from '../errors/AppError.js';

/**
 * UserController - Capa de presentación/API
 * Responsabilidad: Orquestar requests/responses HTTP
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

  async getUsers(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const users = await this.userService.getAllUsers();
    return res.status(200).json(users);
  }

  async createUser(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const userData = req.body;

    try {
      const newUser = await this.userService.createUser(userData);
      return res
        .status(201)
        .json({ message: 'Usuario creado correctamente', data: newUser });
    } catch (error: any) {
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
      if (error?.message === 'INVALID_EMAIL') {
        throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
      }
      if (error?.message === 'INVALID_PASSWORD') {
        throw new AppError(
          'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
          400,
          'INVALID_PASSWORD'
        );
      }
      throw error;
    }
  }

  async getUserById(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new AppError('ID de usuario inválido', 400, 'INVALID_USER_ID');
    }

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    return res.status(200).json(user);
  }

  async getUserByEmail(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const email = req.query.email;
    if (!email || typeof email !== 'string') {
      throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
    }

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    return res.status(200).json(user);
  }

  async editUser(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const userData = req.body;

    if (!id || typeof id !== 'string') {
      throw new AppError('ID de usuario inválido', 400, 'INVALID_USER_ID');
    }
    if (!userData || typeof userData !== 'object') {
      throw new AppError('Datos de usuario inválidos', 400, 'INVALID_USER_DATA');
    }

    try {
      const edited = await this.userService.updateUser(id, userData);
      if (!edited) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
      }

      return res
        .status(200)
        .json({ message: 'Usuario editado correctamente', data: edited });
    } catch (error: any) {
      if (error?.message === 'FORBIDDEN_ROLE') {
        throw new AppError('No se puede asignar rol superadmin', 403, 'FORBIDDEN_ROLE');
      }
      if (error?.message === 'EMAIL_DUPLICATE') {
        throw new AppError('El email ya existe', 409, 'EMAIL_DUPLICATE');
      }
      if (error?.message === 'INVALID_EMAIL') {
        throw new AppError('Email inválido', 400, 'INVALID_EMAIL');
      }
      if (error?.message === 'INVALID_PASSWORD') {
        throw new AppError(
          'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
          400,
          'INVALID_PASSWORD'
        );
      }
      throw error;
    }
  }

  async deleteUser(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new AppError('ID de usuario inválido', 400, 'INVALID_USER_ID');
    }

    const deletedUser = await this.userService.deleteUser(id);
    if (!deletedUser) {
      throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }

    return res
      .status(200)
      .json({ message: 'Usuario eliminado correctamente', data: deletedUser });
  }
}

export const userController = new UserController();
import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.services.js';
import type { Login } from '../interfaces/login.interface.js';
import { AppError } from '../errors/AppError.js';

/**
 * AuthController - Capa de presentación/API para autenticación
 * Responsabilidad: Orquestar requests/responses HTTP de autenticación
 */
export class AuthController {
  async login(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const loginData = (req.body || {}) as Login;

    if (!loginData || typeof loginData.email !== 'string' || typeof loginData.password !== 'string') {
      throw new AppError('Credenciales inválidas', 400, 'INVALID_CREDENTIALS');
    }

    const result = await AuthService.login(loginData);
    return res
      .status(200)
      .json({ message: 'Inicio de sesión exitoso', data: result });
  }
}

export const authController = new AuthController();
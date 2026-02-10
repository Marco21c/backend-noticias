import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.services.js';
import { AppError } from '../errors/AppError.js';
import type { LoginInput } from '../validations/auth.schemas.js';

/**
 * AuthController - Capa de presentación/API para autenticación
 * Responsabilidad: Orquestar requests/responses HTTP de autenticación
 * Convierte errores de negocio a errores HTTP
 */
export class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const loginData = res.locals.validated.body as LoginInput;

        try {
            const result = await AuthService.login(loginData);
            return res.status(200).json({ 
                message: 'Inicio de sesión exitoso', 
                data: result 
            });
        } catch (error: any) {
            // Mapeo de errores de negocio a HTTP
            if (error?.message === 'INVALID_CREDENTIALS') {
                throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
            }
            if (error?.message === 'JWT_SECRET_MISSING') {
                throw new AppError(
                    'Error de configuración del servidor',
                    500,
                    'SERVER_CONFIGURATION_ERROR'
                );
            }
            throw error;
        }
    }
}

export const authController = new AuthController();
import type { Request, Response } from 'express';

import type { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from '../dtos/auth.dto.js';
import { successResponse } from '../dtos/response.dto.js';
import { toUserResponseDto } from '../dtos/user.dto.js';
import { AppError } from '../errors/AppError.js';
import AuthService from '../services/auth.services.js';

/**
 * AuthController - Capa de presentación/API para autenticación
 * Responsabilidad: Orquestar requests/responses HTTP de autenticación
 * Convierte errores de negocio a errores HTTP
 */
export class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const loginData = res.locals.validated.body as LoginRequestDto;

        try {
            const result = await AuthService.login(loginData);
            const response: LoginResponseDto = {
                user: toUserResponseDto(result.user),
                token: result.token
            };
            return res.status(200).json(successResponse(response, 'Inicio de sesión exitoso'));
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

    async register(req: Request, res: Response): Promise<Response> {
        const registerData = res.locals.validated.body as RegisterRequestDto;

        try {
            const result = await AuthService.register(registerData);
            const response: LoginResponseDto = {
                user: toUserResponseDto(result.user),
                token: result.token
            };
            return res.status(201).json(successResponse(response, 'Usuario registrado exitosamente'));
        } catch (error: any) {
            if (error?.message === 'EMAIL_ALREADY_EXISTS') {
                throw new AppError('El email ya está registrado', 400, 'EMAIL_ALREADY_EXISTS');
            }
            throw error;
        }
    }
}

export const authController = new AuthController();
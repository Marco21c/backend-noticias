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
    /**
     * Procesa la solicitud de inicio de sesión de un usuario.
     * 
     * @param req - Request de Express, contiene en res.locals.validated.body los datos validados del usuario (LoginRequestDto).
     * @param res - Response de Express, se usará para devolver el usuario y el token JWT.
     * @returns Responde con estado 200 y el LoginResponseDto, o lanza un AppError.
     * @throws {AppError} 401 si las credenciales son inválidas.
     * @throws {AppError} 500 si falla la firma de JWT.
     */
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

    /**
     * Procesa la solicitud de registro para un nuevo usuario.
     * Por defecto se asigna el rol de "user".
     * 
     * @param req - Request de Express, contiene los datos de registro validados.
     * @param res - Response de Express.
     * @returns Responde con estado 201 y los datos del nuevo usuario + JWT.
     * @throws {AppError} 400 si el correo ya se encuentra en uso en la base de datos.
     */
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
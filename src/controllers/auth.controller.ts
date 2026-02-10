import type { Request, Response } from 'express';
import AuthService from '../services/auth.services.js';
import type { Login } from '../interfaces/login.interface.js';

/**
 * AuthController - Capa de presentación/API para autenticación
 * Responsabilidad: Orquestar requests/responses HTTP de autenticación
 */
export class AuthController {
    
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginData = (req.body || {}) as Login;
            
            // Validar formato básico de entrada
            if (!loginData || typeof loginData.email !== 'string' || typeof loginData.password !== 'string') {
                return res.status(400).json({ message: 'Credenciales inválidas' });
            }
            
            const result = await AuthService.login(loginData);
            return res.status(200).json({ message: 'Inicio de sesión exitoso', data: result });
        } catch (error: any) {
            return res.status(401).json({ message: error?.message || 'Autenticación fallida', error });
        }
    }
}

export const authController = new AuthController();

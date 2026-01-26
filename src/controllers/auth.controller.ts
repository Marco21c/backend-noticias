import type { Request, Response } from 'express';
import AuthService from '../services/auth.services.js';
import type { Login } from '../interfaces/login.interface.js';

export class AuthController {
    
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const loginData = (req.body || {}) as Login;
            if (!loginData || typeof loginData.email !== 'string' || typeof loginData.password !== 'string') {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const result = await AuthService.login(loginData);
            return res.status(200).json({ message: 'Login successful', data: result });
        } catch (error: any) {
            return res.status(401).json({ message: error?.message || 'Authentication failed', error });
        }
    }
}

export const authController = new AuthController();

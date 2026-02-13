import type { IUser } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import env from '../config/env.js';
import type { LoginRequestDto } from '../dtos/auth.dto.js';
import { sanitizeUser } from '../helpers/sanitizeUser.js';

/**
 * AuthService - Capa de lógica de negocio para autenticación
 * Responsabilidad: Lógica de autenticación, JWT, validación de credenciales
 * Independiente de HTTP - lanza Error genérico, Controller mapea a AppError
 */
export class AuthService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserRepository();
    }

    /**
     * Autenticar usuario y generar JWT
     * @param loginData - Credenciales validadas por Zod (futuro: LoginDto)
     * @throws Error con código 'INVALID_CREDENTIALS' si las credenciales son incorrectas
     */
    async login(loginData: LoginRequestDto): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
        const { email, password } = loginData;

        // REGLA DE NEGOCIO: Usuario debe existir
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // REGLA DE NEGOCIO: Password debe coincidir
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // Generar token JWT
        const token = this.signToken({
            id: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
            lastName: user.lastName
        });

        // Retornar usuario sin password
        const userWithoutPassword = sanitizeUser(user);

        return { user: userWithoutPassword, token };
    }

    /**
     * Firmar token JWT
     * @throws Error con código 'JWT_SECRET_MISSING' si JWT_SECRET no está configurado
     */
    signToken(payload: object): string {
        const secret = env.JWT_SECRET;
        const expiresIn = env.JWT_EXPIRES_IN || '7d';

        if (!secret) {
            throw new Error('JWT_SECRET_MISSING');
        }

        return jwt.sign(payload, secret, { expiresIn } as SignOptions);
    }

    /**
     * Verificar token JWT
     * @throws Error con código 'JWT_SECRET_MISSING' si JWT_SECRET no está configurado
     */
    verifyToken(token: string): jwt.JwtPayload | string {
        const secret = env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET_MISSING');
        }

        return jwt.verify(token, secret);
    }

    /**
     * Obtener usuario desde token JWT
     */
    async getUserFromToken(token: string): Promise<Omit<IUser, 'password'> | null> {
        try {
            const decoded = this.verifyToken(token) as any;
            const id = decoded?.id || decoded?._id;
            if (!id) return null;

            return this.userRepository.findById(id, '-password');
        } catch (err) {
            return null;
        }
    }
}

export default new AuthService();
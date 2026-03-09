
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions, type JwtPayload } from 'jsonwebtoken';

import env from '../config/env.js';
import type { LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto.js';
import { sanitizeUser } from '../helpers/sanitizeUser.js';
import type { IUser } from '../interfaces/user.interface.js';
import { UserRepository } from '../repositories/user.repository.js';

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
     * Registrar un nuevo usuario (rol: user por defecto)
     * @param registerData - Datos del usuario a registrar
     * @throws Error si el email ya existe
     */
    async register(registerData: RegisterRequestDto): Promise<{ user: Omit<IUser, 'password'>; token: string }> {
        const { name, lastName, email, password } = registerData;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.userRepository.create({
            name,
            lastName,
            email,
            password: hashedPassword,
            role: 'user',
        });

        const token = this.signToken({
            id: newUser._id,
            role: newUser.role,
            email: newUser.email,
            name: newUser.name,
            lastName: newUser.lastName
        });

        const userWithoutPassword = sanitizeUser(newUser);

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
     * Resuelve el objeto de usuario completo (sin la contraseña) a partir de un token JWT en texto plano.
     * Se usa comúnmente en middlewares de autorización para inyectar el usuario logueado en Express Local.
     * 
     * @param token - Token JWT crudo.
     * @returns Una promesa que resuelve al usuario encontrado Omit<IUser, 'password'> o null si el token expiró/usuario no existe.
     */
    async getUserFromToken(token: string): Promise<Omit<IUser, 'password'> | null> {
        try {
            const decoded = this.verifyToken(token) as JwtPayload;
            const id = decoded?.id || decoded?._id;
            if (!id) return null;

            return this.userRepository.findById(id, '-password');
        } catch {
            return null;
        }
    }
}

export default new AuthService();
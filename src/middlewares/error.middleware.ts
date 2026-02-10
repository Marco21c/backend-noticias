import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.services.js';
import type { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../errors/AppError.js';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const { method, path } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    // Extraer y normalizar header
    const authHeaderRaw = req.headers.authorization;
    const authHeader = Array.isArray(authHeaderRaw)
      ? authHeaderRaw.join(' ')
      : authHeaderRaw ?? '';

    if (!authHeader || typeof authHeader !== 'string' || authHeader.trim() === '') {
      throw new AppError('No se proporcionó token', 401, 'TOKEN_MISSING');
    }

    // Extraer token del formato "Bearer <token>"
    const trimmed = authHeader.trim();
    const token = /^Bearer\s+/i.test(trimmed)
      ? trimmed.replace(/^Bearer\s+/i, '')
      : trimmed;

    if (!token) {
      throw new AppError('No se proporcionó token', 401, 'TOKEN_MISSING');
    }

    // Verificar y decodificar token
    try {
      const decoded = AuthService.verifyToken(token) as any;
      (req as any).tokenPayload = decoded;
    } catch (err: any) {
      // Mapear errores de JWT a AppError
      if (err?.name === 'TokenExpiredError') {
        throw new AppError('Token expirado', 401, 'TOKEN_EXPIRED');
      }
      if (err?.name === 'JsonWebTokenError') {
        throw new AppError('Token inválido', 401, 'TOKEN_INVALID');
      }
      if (err?.message === 'JWT_SECRET_MISSING') {
        throw new AppError(
          'Error de configuración del servidor',
          500,
          'SERVER_CONFIGURATION_ERROR'
        );
      }
      throw new AppError('Token inválido', 401, 'TOKEN_INVALID');
    }

    // Obtener usuario desde token
    const user = await AuthService.getUserFromToken(token);
    if (!user) {
      throw new AppError('Usuario no encontrado', 401, 'USER_NOT_FOUND');
    }

    // Adjuntar usuario al request
    (req as any).user = user as IUser;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: Array<IUser['role']>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as IUser | undefined;

      if (!user) {
        throw new AppError('Usuario no autenticado', 401, 'UNAUTHENTICATED');
      }

      if (!roles.includes(user.role)) {
        throw new AppError(
          `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
          403,
          'INSUFFICIENT_ROLE'
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
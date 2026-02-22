import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';
import type { IUser } from '../interfaces/user.interface.js';
import AuthService from '../services/auth.services.js';

type AuthenticatedRequest = Request & { user: Omit<IUser, 'password'> };

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeaderRaw = req.headers.authorization;
    const authHeader = Array.isArray(authHeaderRaw)
      ? authHeaderRaw.join(' ')
      : authHeaderRaw ?? '';

    if (!authHeader || typeof authHeader !== 'string' || authHeader.trim() === '') {
      throw new AppError('No se proporcionó token', 401, 'TOKEN_MISSING');
    }

    const trimmed = authHeader.trim();
    const token = /^Bearer\s+/i.test(trimmed)
      ? trimmed.replace(/^Bearer\s+/i, '')
      : trimmed;

    if (!token) {
      throw new AppError('No se proporcionó token', 401, 'TOKEN_MISSING');
    }

    const user = await AuthService.getUserFromToken(token);
    if (!user) {
      throw new AppError('Token inválido o expirado', 401, 'TOKEN_INVALID_OR_EXPIRED');
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
      return;
    }
    const error = err as Error & { name?: string };
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expirado', 401, 'TOKEN_EXPIRED'));
      return;
    }
    next(new AppError('Token inválido o mal formado', 401, 'TOKEN_INVALID', error?.message));
  }
}

export function requireRole(...roles: Array<IUser['role']>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        throw new AppError('Acceso denegado', 403, 'ACCESS_DENIED');
      }

      if (!roles.includes(user.role)) {
        throw new AppError('Rol insuficiente', 403, 'INSUFFICIENT_ROLE');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
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

    try {
      const decoded = AuthService.verifyToken(token) as any;
      (req as any).tokenPayload = decoded;
    } catch (err: any) {
      if (err && err.name === 'TokenExpiredError') {
        throw new AppError('Token expirado', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError(
        'Token inválido o mal formado',
        401,
        'TOKEN_INVALID',
        err?.message ?? err
      );
    }

    const user = await AuthService.getUserFromToken(token);
    if (!user) {
      throw new AppError('Token inválido o expirado', 401, 'TOKEN_INVALID_OR_EXPIRED');
    }

    (req as any).user = user as IUser;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles: Array<IUser['role']>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as IUser | undefined;

    if (!user) {
      throw new AppError('Acceso denegado', 403, 'ACCESS_DENIED');
    }

    if (!roles.includes(user.role)) {
      throw new AppError('Rol insuficiente', 403, 'INSUFFICIENT_ROLE');
    }

    return next();
  };
}
import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.services.js';
import type { IUser } from '../interfaces/user.interface.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const { method, path } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
}

  export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeaderRaw = req.headers.authorization;
      const authHeader = Array.isArray(authHeaderRaw)
        ? authHeaderRaw.join(' ')
        : authHeaderRaw ?? '';

      if (!authHeader || typeof authHeader !== 'string' || authHeader.trim() === '') {
        return res.status(401).json({ message: 'No se proporcionó token' });
      }

      const trimmed = authHeader.trim();
      const token = /^Bearer\s+/i.test(trimmed) ? trimmed.replace(/^Bearer\s+/i, '') : trimmed;

      if (!token) return res.status(401).json({ message: 'No se proporcionó token' });
      try {
        const decoded = AuthService.verifyToken(token) as any;
        (req as any).tokenPayload = decoded;
      } catch (err: any) {
        if (err && err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expirado' });
        return res.status(401).json({ message: 'Token inválido o mal formado', error: err?.message ?? err });
      }

      const user = await AuthService.getUserFromToken(token);
      if (!user) return res.status(401).json({ message: 'Token inválido o expirado' });

      (req as any).user = user as IUser;
      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      return res.status(401).json({ message: 'Autenticación fallida', error: message });
    }
  }


export function requireRole(...roles: Array<IUser['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as IUser | undefined;
    if (!user) return res.status(403).json({ message: 'Acceso denegado' });
    if (!roles.includes(user.role)) return res.status(403).json({ message: 'Rol insuficiente' });
    return next();
  };
}

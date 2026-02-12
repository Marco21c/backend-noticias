import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const { method, path } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path}`);
  next();
}


export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err.details, stack: err.stack }),
    });
  }
  // Error no controlado
  console.error('❌ Error no controlado:', err);
  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message,
  });
}
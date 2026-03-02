import type { Request, Response, NextFunction } from 'express';
import type { ZodIssue } from 'zod';

import { AppError } from '../errors/AppError.js';
import { formatValidationErrors } from '../helpers/formatValidationErrors.js';
import logger from '../utils/logger.js';

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND'));
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      success: false,
      code: err.code,
      message: err.message,
    };

    if (process.env.NODE_ENV === 'development') {
      if (Array.isArray(err.details) && err.details.length > 0) {
        response.details = formatValidationErrors(err.details as ZodIssue[]);
      }
      response.stack = err.stack;
    }

    return res.status(err.statusCode).json(response);
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
}
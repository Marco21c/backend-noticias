import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.statusCode || err?.status || 500;
  const payload: Record<string, any> = {
    status: 'error',
    statusCode: status,
    message: err?.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err?.stack;
    payload.details = err?.details ?? undefined;
  }

  res.status(status).json(payload);
}

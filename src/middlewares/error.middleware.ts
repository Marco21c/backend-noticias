import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError.js';

export function notFound(req: Request, res: Response, next: NextFunction) {
    next(
        new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404, 'ROUTE_NOT_FOUND') 
    );
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction){
    let appError: AppError;

    // Errores esperados
    if (err instanceof AppError) {
        appError = err;


    // Errores de MongoDB
    } else if (err instanceof mongoose.Error.CastError) {
        appError = new AppError('ID de Mongo invalido', 400, 'INVALID_MONGO_ID', {
            path: err.path,
            value: err.value,
        });
    } else if (err instanceof mongoose.Error.ValidationError) {
        appError = new AppError('Error de validacion', 400, 'MONGOOSE_VALIDATION_ERROR', err.errors);
    } else if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 11000) {
        appError = new AppError('Recurso duplicado', 409, 'DUPLICATE_KEY', (err as any).keyValue);

    // Errores desconocidos
    } else {
        appError = new AppError('Error interno del servidor', 500, 'INTERNAL_SERVER_ERROR');
    }

    const payload: any = {
        success: false,
        message: appError.message,
        code: appError.code,
    };

    if (appError.details !== undefined) payload.details = appError.details;

    if (!(err instanceof AppError)) {
        console.error('Error desconocido:', err);
    }

    return res.status(appError.statusCode).json(payload);
}
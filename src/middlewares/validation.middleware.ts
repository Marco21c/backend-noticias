import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

type RequestPart = 'body' | 'query' | 'params';

type Schemas = Partial<Record<RequestPart, ZodType<any>>>;

type ValidatedRequest = {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };

/**
 * Valida partes del request (body, query, params) con Zod.
 * Si falla, lanza AppError 400.
 */

export function validateRequest(schemas: Schemas) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated: ValidatedRequest = {};
  
        if (schemas.body) {
          validated.body = schemas.body.parse(req.body);
        }
  
        if (schemas.query) {
          validated.query = schemas.query.parse(req.query);
        }
  
        if (schemas.params) {
          validated.params = schemas.params.parse(req.params);
        }
  
        res.locals.validated = validated;
  
        return next();
      } catch (err) {
        if (err instanceof ZodError) {
          return next(
            new AppError(
              'Error de validacion de entrada',
              400,
              'REQUEST_VALIDATION_ERROR',
              err.issues
            )
          );
        }
  
        return next(err);
      }
    };
  }
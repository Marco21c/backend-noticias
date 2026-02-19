import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

/** Partes del request que pueden ser validadas */
type RequestPart = 'body' | 'query' | 'params';

/** Esquemas de validación para cada parte del request */
type Schemas = Partial<Record<RequestPart, ZodType<any>>>;

/** Request con datos validados */
type ValidatedRequest = {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };

/**
 * Middleware factory que valida partes del request (body, query, params) con Zod.
 * Los datos validados se almacenan en res.locals.validated.
 * Si la validación falla, lanza un AppError con código 400.
 *
 * @param schemas - Objeto con los esquemas Zod para validar body, query y/o params
 * @returns Middleware de Express para validación
 *
 * @example
 * ```typescript
 * router.post('/users',
 *   validateRequest({ body: createUserSchema }),
 *   userController.create
 * );
 * ```
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
              'Error de validación de entrada',
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
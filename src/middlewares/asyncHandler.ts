import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrapper para controladores asíncronos que maneja automáticamente errores.
 * Evita la necesidad de usar try-catch en cada controlador asíncrono.
 * Los errores son capturados y pasados al middleware de manejo de errores de Express.
 *
 * @param fn - Función controladora asíncrona
 * @returns Middleware de Express con manejo de errores integrado
 *
 * @example
 * ```typescript
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAll();
 *   res.json(users);
 * }));
 * ```
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
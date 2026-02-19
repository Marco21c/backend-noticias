/**
 * @fileoverview DTO de respuesta estandarizada para la API REST.
 * Todas las respuestas exitosas deben seguir este formato.
 */

/**
 * Estructura de respuesta exitosa de la API.
 *
 * @template T - Tipo de los datos retornados
 */
export type ApiSuccessResponse<T> = {
  /** Indicador de éxito de la operación */
  success: true;
  /** Mensaje opcional descriptivo */
  message?: string;
  /** Datos retornados por la operación */
  data: T;
};

/**
 * Crea una respuesta exitosa estandarizada.
 *
 * @template T - Tipo de los datos
 * @param data - Datos a incluir en la respuesta
 * @param message - Mensaje descriptivo opcional
 * @returns Objeto de respuesta formateado
 *
 * @example
 * ```typescript
 * res.json(successResponse(user, 'Usuario creado exitosamente'));
 * ```
 */
export function successResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  const payload: ApiSuccessResponse<T> = { success: true, data };
  if (message) {
    payload.message = message;
  }
  return payload;
}

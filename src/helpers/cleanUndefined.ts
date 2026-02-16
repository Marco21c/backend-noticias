/**
 * Elimina recursivamente las propiedades con valor `undefined` de un objeto.
 * Útil para limpiar datos antes de guardar en base de datos o enviar respuestas.
 *
 * @template T - Tipo del objeto de entrada
 * @param obj - Objeto del cual eliminar propiedades undefined
 * @returns Nuevo objeto sin propiedades undefined
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: undefined, c: 'test', d: null };
 * const cleaned = cleanUndefined(obj);
 * // Resultado: { a: 1, c: 'test', d: null }
 * ```
 */
export function cleanUndefined<T extends Record<string, any>>(obj: T): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            result[key] = value;
        }
    }

    return result;
}
/**
 * Elimina propiedades undefined del objeto
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
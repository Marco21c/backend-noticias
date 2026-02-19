/**
 * Error personalizado de la aplicación.
 * Extiende Error nativo de JavaScript para incluir información adicional
 * útil para el manejo de errores HTTP en la API.
 *
 * @example
 * ```typescript
 * throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
 * ```
 */
export class AppError extends Error {
    /** Código de estado HTTP */
    public readonly statusCode: number;
    /** Código de error interno de la aplicación */
    public readonly code?: string;
    /** Detalles adicionales para depuración */
    public readonly details?: unknown;

    /**
     * Crea una nueva instancia de AppError.
     *
     * @param message - Mensaje descriptivo del error
     * @param statusCode - Código de estado HTTP (por defecto: 500)
     * @param code - Código de error interno (por defecto: 'UNKNOWN_ERROR')
     * @param details - Detalles adicionales para depuración
     */
    constructor(
        message: string,
        statusCode: number = 500,
        code?: string,
        details?: unknown,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || 'UNKNOWN_ERROR';
        this.details = details;

        // * Configurar el prototipo del error para mantener la cadena de prototipos
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
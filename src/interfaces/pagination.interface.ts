/**
 * Interfaz para opciones de paginación en consultas
 */
export interface IPaginationOptions {
  /** Número de página (empezando en 1) */
  page?: number;
  /** Cantidad de items por página */
  limit?: number;
}

/**
 * Interfaz para metadatos de paginación en respuestas
 */
export interface IPaginationMetadata {
  /** Total de items en la base de datos */
  total: number;
  /** Página actual */
  page: number;
  /** Items por página */
  limit: number;
  /** Total de páginas disponibles */
  totalPages: number;
}

/**
 * Interfaz genérica para respuestas paginadas
 * @template T - Tipo de los items en el array de resultados
 */
export interface IPaginatedResponse<T> {
  /** Array de resultados de la página actual */
  results: T[];
  /** Total de items disponibles */
  total: number;
  /** Número de página actual */
  page: number;
  /** Total de páginas */
  totalPages: number;
}

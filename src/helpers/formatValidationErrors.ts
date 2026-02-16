import type { ZodIssue } from 'zod';

/**
 * Transforma array de issues de Zod a objeto mapeado por campos
 * @param issues - Array de ZodIssue
 * @returns Objeto { campo: mensaje }
 */
export function formatValidationErrors(issues: ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path.join('.') || 'general';
    errors[field] = issue.message;
  }

  return errors;
}

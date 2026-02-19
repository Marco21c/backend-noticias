import { z } from 'zod';

// ============================================
// CONSTANTES
// ============================================
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nombre de categoría inválido').trim(),
  description: z.string().default(''),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.string().regex(mongoIdRegex, 'ID de MongoDB inválido'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;

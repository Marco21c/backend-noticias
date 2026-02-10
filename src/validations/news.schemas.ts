import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

export const createNewsSchema = z.object({
  title: z.string().min(3, 'Título demasiado corto'),
  slug: z.string().min(3, 'Slug demasiado corto'),
  summary: z.string().min(10, 'Resumen demasiado corto'),
  content: z.string().min(20, 'Contenido demasiado corto'),
  highlights: z.array(z.string().min(1)).default([]),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de categoría inválido'),
  mainImage: z.url('URL de imagen inválida').optional(),
  source: z.string().optional(),
  variant: z.enum(['highlighted', 'featured', 'default']).default('default'),
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB inválido'),
});

export const newsQuerySchema = z.object({
  status: z
    .enum(['draft', 'in_review', 'approved', 'published', 'rejected'])
    .optional(),
  author: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de autor inválido').optional(),
});

export const newsByCategoryQuerySchema = z.object({
  category: z.string().min(1, 'Categoría de noticia inválida'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
export type NewsQuery = z.infer<typeof newsQuerySchema>;
export type NewsIdParam = z.infer<typeof newsIdParamSchema>;
export type NewsByCategoryQuery = z.infer<typeof newsByCategoryQuerySchema>;

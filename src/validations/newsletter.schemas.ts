import { z } from 'zod';

// ============================================
// CONSTANTES Y REGEX
// ============================================
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================

/**
 * Schema para suscribirse al newsletter
 * - preferredCategories: array de IDs de MongoDB (máximo 3)
 */
export const subscribeSchema = z.object({
	preferredCategories: z
		.array(z.string().regex(mongoIdRegex, 'ID de categoría inválido'))
		.max(3, 'Máximo 3 categorías permitidas')
		.optional()
		.default([]),
});

/**
 * Schema para actualizar preferencias
 * - preferredCategories: array de IDs de MongoDB (máximo 3)
 */
export const updatePreferencesSchema = z.object({
	preferredCategories: z
		.array(z.string().regex(mongoIdRegex, 'ID de categoría inválido'))
		.max(3, 'Máximo 3 categorías permitidas')
		.min(1, 'Debe seleccionar al menos 1 categoría'),
});

/**
 * Schema para parámetro de ID de MongoDB
 */
export const newsletterIdParamSchema = z.object({
	id: z.string().regex(mongoIdRegex, 'ID de MongoDB inválido'),
});

/**
 * Schema para búsqueda por email
 */
export const newsletterEmailParamSchema = z.object({
	email: z.string().email('Email inválido'),
});

/**
 * Schema para búsqueda por categoría
 */
export const newsletterCategoryParamSchema = z.object({
	categoryId: z.string().regex(mongoIdRegex, 'ID de categoría inválido'),
});

/**
 * Schema para obtener ultimas noticias del newsletter
 */
export const newsletterLatestNewsQuerySchema = z.object({
	limit: z.coerce
		.number()
		.int('El límite debe ser un número entero')
		.min(1, 'El límite debe ser al menos 1')
		.max(50, 'El límite máximo es 50')
		.default(10)
		.optional(),
});

// ============================================
// TIPOS INFERIDOS
// ============================================
export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type NewsletterIdParam = z.infer<typeof newsletterIdParamSchema>;
export type NewsletterEmailParam = z.infer<typeof newsletterEmailParamSchema>;
export type NewsletterCategoryParam = z.infer<typeof newsletterCategoryParamSchema>;
export type NewsletterLatestNewsQuery = z.infer<
	typeof newsletterLatestNewsQuerySchema
>;

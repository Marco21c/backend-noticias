import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
export const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'), // Solo verificar que existe
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type LoginInput = z.infer<typeof loginSchema>;

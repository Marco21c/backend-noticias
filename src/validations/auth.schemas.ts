import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type LoginInput = z.infer<typeof loginSchema>;

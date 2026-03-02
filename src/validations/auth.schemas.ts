import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida'),
});

export const registerSchema = z.object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    lastName: z.string().min(3, 'El apellido debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

import { z } from 'zod';

// ============================================
// CONSTANTES Y REGEX
// ============================================
const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
const baseUserSchema = z.object({
    email: z.email('Email inválido'),
    role: z.enum(['admin', 'editor', 'user', 'superadmin']).default('user'),
    name: z.string().min(2, 'Nombre demasiado corto'),
    lastName: z.string().min(2, 'Apellido demasiado corto'),
});

export const createUserSchema = baseUserSchema.extend({
    password: z
        .string()
        .regex(
            passwordStrong,
            'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
        ),
});

export const updateUserSchema = baseUserSchema
    .partial()
    .extend({
        password: z
            .string()
            .regex(
                passwordStrong,
                'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
            )
            .optional(),
    });

export const userIdParamSchema = z.object({
    id: z.string().regex(mongoIdRegex, 'ID de MongoDB inválido'),
});

export const userEmailQuerySchema = z.object({
    email: z.email('Email inválido'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type UserEmailQuery = z.infer<typeof userEmailQuerySchema>;
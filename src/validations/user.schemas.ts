import { z } from 'zod';

// ============================================
// CONSTANTES Y REGEX
// ============================================
const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

// ============================================
// PAGINATION SCHEMA
// ============================================
export const paginationSchema = z.object({
    page: z.coerce.number()
        .int('La página debe ser un número entero')
        .positive('La página debe ser mayor a 0')
        .default(1)
        .optional(),
    limit: z.coerce.number()
        .int('El límite debe ser un número entero')
        .min(1, 'El límite debe ser al menos 1')
        .max(100, 'El límite máximo es 100')
        .default(10)
        .optional(),
});

// ============================================
// SCHEMAS DE VALIDACIÓN
// ============================================
const baseUserSchema = z.object({
    email: z.string().email('Email inválido'),
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
    email: z.string().email('Email inválido'),
});

// ============================================
// TIPOS INFERIDOS (para usar como DTOs temporales)
// ============================================
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type UserEmailQuery = z.infer<typeof userEmailQuerySchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
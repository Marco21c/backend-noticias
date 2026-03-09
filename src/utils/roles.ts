/**
 * Roles de usuario en el sistema.
 * Utilizados para comprobación de persistencia y middlewares de autorización.
 */
export const USER_ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

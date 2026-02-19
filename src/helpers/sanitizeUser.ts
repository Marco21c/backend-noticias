import type { IUser } from "../interfaces/user.interface.js";

/**
 * Elimina la propiedad `password` de un objeto usuario antes de retornarlo.
 * Útil para enviar datos de usuario sin exponer información sensible.
 * Soporta tanto objetos planos como documentos de Mongoose.
 *
 * @param user - Objeto usuario (puede ser documento Mongoose o objeto plano)
 * @returns Objeto usuario sin la propiedad password
 *
 * @example
 * ```typescript
 * const user = await UserModel.findById(id);
 * const safeUser = sanitizeUser(user);
 * // safeUser no contiene la propiedad password
 * res.json(safeUser);
 * ```
 */
export const sanitizeUser = (user: any): IUser => {
    const obj = user.toObject ? user.toObject() : user;
    delete obj.password;
    return obj;
}
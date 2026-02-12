import type { IUser } from "../interfaces/user.interface.js";

export const sanitizeUser = (user: any): IUser => {
    const obj = user.toObject ? user.toObject() : user;
    delete obj.password;
    return obj;
}
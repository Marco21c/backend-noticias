import type { IUser } from '../interfaces/user.interface.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
  UserEmailQuery
} from '../validations/user.schemas.js';

export type CreateUserRequestDto = CreateUserInput;
export type UpdateUserRequestDto = UpdateUserInput;
export type UserIdRequestDto = UserIdParam;
export type UserEmailRequestDto = UserEmailQuery;

export type UserResponseDto = {
  id: string;
  email: string;
  role: IUser['role'];
  name: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
};

function normalizeId(id: unknown): string {
  return id ? String(id) : '';
}

export function toUserResponseDto(user: IUser | any): UserResponseDto {
  const obj = user?.toObject ? user.toObject() : user;

  return {
    id: normalizeId(obj._id ?? obj.id),
    email: obj.email,
    role: obj.role,
    name: obj.name ?? '',
    lastName: obj.lastName ?? '',
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
}

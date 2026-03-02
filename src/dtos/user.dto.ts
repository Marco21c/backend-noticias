import type { IPaginatedResponse } from '../interfaces/pagination.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
  UserEmailQuery,
  PaginationQuery
} from '../validations/user.schemas.js';

/**
 * DTO for creating a new user.
 * @typedef {CreateUserInput} CreateUserRequestDto
 */
export type CreateUserRequestDto = CreateUserInput;

/**
 * DTO for updating an existing user.
 * @typedef {UpdateUserInput} UpdateUserRequestDto
 */
export type UpdateUserRequestDto = UpdateUserInput;

/**
 * DTO for user ID parameter.
 * @typedef {UserIdParam} UserIdRequestDto
 */
export type UserIdRequestDto = UserIdParam;

/**
 * DTO for user email query.
 * @typedef {UserEmailQuery} UserEmailRequestDto
 */
export type UserEmailRequestDto = UserEmailQuery;

/**
 * DTO for pagination query.
 */
export type PaginationRequestDto = PaginationQuery;

/**
 * DTO for paginated users response.
 */
export type PaginatedUsersResponseDto = IPaginatedResponse<IUser>;

/**
 * User response DTO.
 * Represents a user without sensitive data like password.
 */
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

type UserInput = Partial<IUser> & { toObject?: () => IUser; _id?: unknown; role: IUser['role'] };

/**
 * Transforms a user entity to a response DTO.
 * @param user - User entity or mongoose document
 * @returns User response DTO without password
 */
export function toUserResponseDto(user: UserInput): UserResponseDto {
  const obj = typeof user.toObject === 'function' ? user.toObject() : user;

  const response: UserResponseDto = {
    id: normalizeId(obj._id),
    email: String(obj.email ?? ''),
    role: obj.role,
    name: String(obj.name ?? ''),
    lastName: String(obj.lastName ?? ''),
  };

  if (obj.createdAt) response.createdAt = obj.createdAt;
  if (obj.updatedAt) response.updatedAt = obj.updatedAt;

  return response;
}

import type { LoginInput, RegisterInput } from '../validations/auth.schemas.js';

import type { UserResponseDto } from './user.dto.js';

/**
 * DTO for login request.
 * @typedef {LoginInput} LoginRequestDto
 */
export type LoginRequestDto = LoginInput;

/**
 * DTO for register request.
 * @typedef {RegisterInput} RegisterRequestDto
 */
export type RegisterRequestDto = RegisterInput;

/**
 * DTO for login response.
 * Contains authenticated user and JWT token.
 */
export type LoginResponseDto = {
  user: UserResponseDto;
  token: string;
};

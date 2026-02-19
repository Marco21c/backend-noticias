import type { LoginInput } from '../validations/auth.schemas.js';
import type { UserResponseDto } from './user.dto.js';

export type LoginRequestDto = LoginInput;

export type LoginResponseDto = {
  user: UserResponseDto;
  token: string;
};

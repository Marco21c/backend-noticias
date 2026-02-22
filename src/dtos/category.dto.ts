import type { ICategory } from '../interfaces/category.interface.js';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryIdParam
} from '../validations/category.schemas.js';

/**
 * DTO for creating a new category.
 * @typedef {CreateCategoryInput} CreateCategoryRequestDto
 */
export type CreateCategoryRequestDto = CreateCategoryInput;

/**
 * DTO for updating an existing category.
 * @typedef {UpdateCategoryInput} UpdateCategoryRequestDto
 */
export type UpdateCategoryRequestDto = UpdateCategoryInput;

/**
 * DTO for category ID parameter.
 * @typedef {CategoryIdParam} CategoryIdRequestDto
 */
export type CategoryIdRequestDto = CategoryIdParam;

/**
 * Category response DTO.
 * Represents a category in API responses.
 */
export type CategoryResponseDto = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type CategoryInput = ICategory & { toObject?: () => ICategory; _id?: unknown };

/**
 * Transforms a category entity to a response DTO.
 * @param category - Category entity or mongoose document
 * @returns Category response DTO
 */
export function toCategoryResponseDto(category: CategoryInput): CategoryResponseDto {
  const obj = typeof category.toObject === 'function' ? category.toObject() : category;

  const response: CategoryResponseDto = {
    id: String(obj._id ?? ''),
    name: String(obj.name ?? ''),
    isActive: Boolean(obj.isActive),
  };

  if (obj.description) response.description = obj.description;
  if (obj.createdAt) response.createdAt = obj.createdAt;
  if (obj.updatedAt) response.updatedAt = obj.updatedAt;

  return response;
}

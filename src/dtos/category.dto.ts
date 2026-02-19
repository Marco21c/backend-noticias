import type { ICategory } from '../interfaces/category.interface.js';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryIdParam
} from '../validations/category.schemas.js';

export type CreateCategoryRequestDto = CreateCategoryInput;
export type UpdateCategoryRequestDto = UpdateCategoryInput;
export type CategoryIdRequestDto = CategoryIdParam;

export type CategoryResponseDto = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export function toCategoryResponseDto(category: ICategory | any): CategoryResponseDto {
  const obj = category?.toObject ? category.toObject() : category;

  return {
    id: String(obj._id ?? obj.id),
    name: obj.name,
    description: obj.description ?? '',
    isActive: Boolean(obj.isActive),
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt
  };
}

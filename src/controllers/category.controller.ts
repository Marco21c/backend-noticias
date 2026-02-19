import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.services.js';
import { AppError } from '../errors/AppError.js';
import type {
    CreateCategoryRequestDto,
    UpdateCategoryRequestDto,
    CategoryIdRequestDto
} from '../dtos/category.dto.js';
import { toCategoryResponseDto } from '../dtos/category.dto.js';
import { successResponse } from '../dtos/response.dto.js';

/**
 * CategoryController - Capa de presentación/API
 * Responsabilidad: Orquestar requests/responses HTTP
 * Confía en validaciones de Zod hechas en middleware
 */
export class CategoryController {
    private categoryService: CategoryService;

    constructor(categoryService?: CategoryService) {
        this.categoryService = categoryService || new CategoryService();

        this.getCategories = this.getCategories.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.getCategoryById = this.getCategoryById.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    async getCategories(_req: Request, res: Response): Promise<Response> {
        const categories = await this.categoryService.getAllCategories();
        const payload = categories.map(toCategoryResponseDto);
        return res.status(200).json(successResponse(payload));
    }

    async createCategory(req: Request, res: Response): Promise<Response> {
        const categoryData = res.locals.validated.body as CreateCategoryRequestDto;

        try {
            const created = await this.categoryService.createCategory(categoryData);
            const payload = toCategoryResponseDto(created);
            return res
                .status(201)
                .json(successResponse(payload, 'Categoría creada correctamente'));
        } catch (error: any) {
            // Mapeo de errores de negocio a HTTP
            if (error?.message === 'NAME_DUPLICATE') {
                throw new AppError('La categoría ya existe', 409, 'CATEGORY_NAME_DUPLICATE');
            }
            throw error;
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as CategoryIdRequestDto;

        const category = await this.categoryService.getCategoryById(id);
        if (!category) {
            throw new AppError('Categoría no encontrada', 404, 'CATEGORY_NOT_FOUND');
        }

        return res.status(200).json(successResponse(toCategoryResponseDto(category)));
    }

    async editCategory(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as CategoryIdRequestDto;
        const categoryData = res.locals.validated.body as UpdateCategoryRequestDto;

        try {
            const edited = await this.categoryService.updateCategory(id, categoryData);
            if (!edited) {
                throw new AppError('Categoría no encontrada', 404, 'CATEGORY_NOT_FOUND');
            }

            const payload = toCategoryResponseDto(edited);
            return res
                .status(200)
                .json(successResponse(payload, 'Categoría editada correctamente'));
        } catch (error: any) {
            // Mapeo de errores de negocio a HTTP
            if (error?.message === 'NAME_DUPLICATE') {
                throw new AppError('La categoría ya existe', 409, 'CATEGORY_NAME_DUPLICATE');
            }
            throw error;
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<Response> {
        const { id } = res.locals.validated.params as CategoryIdRequestDto;

        const deleted = await this.categoryService.deleteCategory(id);
        if (!deleted) {
            throw new AppError('Categoría no encontrada', 404, 'CATEGORY_NOT_FOUND');
        }

        const payload = toCategoryResponseDto(deleted);
        return res
            .status(200)
            .json(successResponse(payload, 'Categoría eliminada correctamente'));
    }
}

export const categoryController = new CategoryController();
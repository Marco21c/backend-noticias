import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.services.js';
import { AppError } from '../errors/AppError.js';

/**
 * CategoryController - Capa de presentacion/API
 * Responsabilidad: Orquestar requests/responses HTTP
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

  async getCategories(_req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const categories = await this.categoryService.getAllCategories();
    return res.status(200).json(categories);
  }

  async createCategory(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const categoryData = req.body;

    try {
      const created = await this.categoryService.createCategory(categoryData);
      return res
        .status(201)
        .json({ message: 'Categoria creada correctamente', data: created });
    } catch (error: any) {
      if (error?.message === 'INVALID_NAME') {
        throw new AppError('Nombre de categoria invalido', 400, 'INVALID_CATEGORY_NAME');
      }
      if (error?.message === 'NAME_DUPLICATE') {
        throw new AppError('La categoria ya existe', 409, 'CATEGORY_NAME_DUPLICATE');
      }
      throw error;
    }
  }

  async getCategoryById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new AppError('ID de categoria invalido', 400, 'INVALID_CATEGORY_ID');
    }

    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      throw new AppError('Categoria no encontrada', 404, 'CATEGORY_NOT_FOUND');
    }

    return res.status(200).json(category);
  }

  async editCategory(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    const categoryData = req.body;

    if (!id || typeof id !== 'string') {
      throw new AppError('ID de categoria invalido', 400, 'INVALID_CATEGORY_ID');
    }
    if (!categoryData || typeof categoryData !== 'object') {
      throw new AppError('Datos de categoria invalidos', 400, 'INVALID_CATEGORY_DATA');
    }

    try {
      const edited = await this.categoryService.updateCategory(id, categoryData);
      if (!edited) {
        throw new AppError('Categoria no encontrada', 404, 'CATEGORY_NOT_FOUND');
      }

      return res
        .status(200)
        .json({ message: 'Categoria editada correctamente', data: edited });
    } catch (error: any) {
      if (error?.message === 'INVALID_NAME') {
        throw new AppError('Nombre de categoria invalido', 400, 'INVALID_CATEGORY_NAME');
      }
      if (error?.message === 'NAME_DUPLICATE') {
        throw new AppError('La categoria ya existe', 409, 'CATEGORY_NAME_DUPLICATE');
      }
      throw error;
    }
  }

  async deleteCategory(req: Request, res: Response, _next: NextFunction): Promise<Response> {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new AppError('ID de categoria invalido', 400, 'INVALID_CATEGORY_ID');
    }

    const deleted = await this.categoryService.deleteCategory(id);
    if (!deleted) {
      throw new AppError('Categoria no encontrada', 404, 'CATEGORY_NOT_FOUND');
    }

    return res
      .status(200)
      .json({ message: 'Categoria eliminada correctamente', data: deleted });
  }
}

export const categoryController = new CategoryController();
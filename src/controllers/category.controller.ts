import type { Request, Response } from 'express';
import { CategoryService } from '../services/category.services.js';

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

	async getCategories(req: Request, res: Response): Promise<Response> {
		try {
			const categories = await this.categoryService.getAllCategories();
			return res.status(200).json(categories);
		} catch (error) {
			console.error('Error en getCategories:', error);
			return res.status(500).json({
				message: 'Error al obtener categorias',
				error: error instanceof Error ? error.message : 'Error desconocido'
			});
		}
	}

	async createCategory(req: Request, res: Response): Promise<Response> {
		try {
			const categoryData = req.body;
			const created = await this.categoryService.createCategory(categoryData);
			return res.status(201).json({ message: 'Categoria creada correctamente', data: created });
		} catch (error: any) {
			if (error && error.message === 'INVALID_NAME') {
				return res.status(400).json({ message: 'Nombre de categoria invalido' });
			}
			if (error && error.message === 'NAME_DUPLICATE') {
				return res.status(409).json({ message: 'La categoria ya existe' });
			}
			console.error('Error en createCategory:', error);
			return res.status(500).json({
				message: 'Error al crear categoria',
				error: error instanceof Error ? error.message : 'Error desconocido'
			});
		}
	}

	async getCategoryById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de categoria invalido' });
			}

			const category = await this.categoryService.getCategoryById(id);
			if (!category) return res.status(404).json({ message: 'Categoria no encontrada' });

			return res.status(200).json(category);
		} catch (error) {
			console.error('Error en getCategoryById:', error);
			return res.status(500).json({
				message: 'Error al obtener categoria',
				error: error instanceof Error ? error.message : 'Error desconocido'
			});
		}
	}

	async editCategory(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const categoryData = req.body;

			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de categoria invalido' });
			}
			if (!categoryData || typeof categoryData !== 'object') {
				return res.status(400).json({ message: 'Datos de categoria invalidos' });
			}

			const edited = await this.categoryService.updateCategory(id, categoryData);
			if (!edited) return res.status(404).json({ message: 'Categoria no encontrada' });

			return res.status(200).json({ message: 'Categoria editada correctamente', data: edited });
		} catch (error: any) {
			if (error && error.message === 'INVALID_NAME') {
				return res.status(400).json({ message: 'Nombre de categoria invalido' });
			}
			if (error && error.message === 'NAME_DUPLICATE') {
				return res.status(409).json({ message: 'La categoria ya existe' });
			}
			console.error('Error en editCategory:', error);
			return res.status(500).json({
				message: 'Error al editar categoria',
				error: error instanceof Error ? error.message : 'Error desconocido'
			});
		}
	}

	async deleteCategory(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de categoria invalido' });
			}
			const deleted = await this.categoryService.deleteCategory(id);
			if (!deleted) return res.status(404).json({ message: 'Categoria no encontrada' });

			return res.status(200).json({ message: 'Categoria eliminada correctamente', data: deleted });
		} catch (error) {
			console.error('Error en deleteCategory:', error);
			return res.status(500).json({
				message: 'Error al eliminar categoria',
				error: error instanceof Error ? error.message : 'Error desconocido'
			});
		}
	}
}

export const categoryController = new CategoryController();

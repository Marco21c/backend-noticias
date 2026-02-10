import type { ICategory } from '../interfaces/category.interface.js';
import { CategoryRepository } from '../repositories/category.repository.js';

/**
 * CategoryService - Capa de logica de negocio para Categories
 * Responsabilidad: Validaciones y reglas de negocio
 */
export class CategoryService {
	private categoryRepository: CategoryRepository;

	constructor(categoryRepository?: CategoryRepository) {
		this.categoryRepository = categoryRepository || new CategoryRepository();
	}

	/**
	 * Obtener todas las categorias
	 */
	async getAllCategories(): Promise<ICategory[]> {
		return this.categoryRepository.findAll();
	}

	/**
	 * Obtener categoria por ID
	 */
	async getCategoryById(id: string): Promise<ICategory | null> {
		return this.categoryRepository.findById(id);
	}

	/**
	 * Crear una nueva categoria
	 */
	async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
		this.validateName(categoryData.name);

		const existing = await this.categoryRepository.findByName(categoryData.name as string);
		if (existing) {
			throw new Error('NAME_DUPLICATE');
		}

		return this.categoryRepository.create({
			name: String(categoryData.name).trim(),
			description: categoryData.description ?? '',
			isActive: categoryData.isActive ?? true
		});
	}

	/**
	 * Editar una categoria existente
	 */
	async updateCategory(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
		if (categoryData.name) {
			this.validateName(categoryData.name);
			const existing = await this.categoryRepository.findByName(categoryData.name);
			if (existing && existing._id?.toString() !== id) {
				throw new Error('NAME_DUPLICATE');
			}
		}

		const payload: Partial<ICategory> = {};
		if (categoryData.name) payload.name = String(categoryData.name).trim();
		if (typeof categoryData.description === 'string') payload.description = categoryData.description;
		if (typeof categoryData.isActive === 'boolean') payload.isActive = categoryData.isActive;

		return this.categoryRepository.update(id, payload);
	}

	/**
	 * Eliminar una categoria
	 */
	async deleteCategory(id: string): Promise<ICategory | null> {
		return this.categoryRepository.delete(id);
	}

	private validateName(name?: string): void {
		if (!name || typeof name !== 'string' || name.trim().length < 2) {
			throw new Error('INVALID_NAME');
		}
	}
}

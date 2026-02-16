import type { ICategory } from '../interfaces/category.interface.js';
import CategoryModel from '../models/category.model.js';

/**
 * Repositorio para operaciones de acceso a datos de Categorías.
 * Implementa el patrón Repository para abstraer las operaciones CRUD.
 *
 * @example
 * ```typescript
 * const categoryRepo = new CategoryRepository();
 * const categories = await categoryRepo.findAll();
 * ```
 */
export class CategoryRepository {
	/**
	 * Obtiene todas las categorías registradas en el sistema.
	 *
	 * @returns Promise con array de categorías ordenadas por nombre
	 */
	async findAll(): Promise<ICategory[]> {
		return CategoryModel.find().sort({ name: 1 }).exec();
	}

	/**
	 * Busca una categoría por su ID único.
	 *
	 * @param id - ID de MongoDB de la categoría
	 * @returns Categoría encontrada o null si no existe
	 */
	async findById(id: string): Promise<ICategory | null> {
		return CategoryModel.findById(id).exec();
	}

	/**
	 * Busca una categoría por su nombre (búsqueda insensible a mayúsculas).
	 *
	 * @param name - Nombre de la categoría a buscar
	 * @returns Categoría encontrada o null si no existe
	 */
	async findByName(name: string): Promise<ICategory | null> {
		const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const nameRegex = new RegExp('^' + escaped + '$', 'i');
		return CategoryModel.findOne({ name: { $regex: nameRegex } }).exec();
	}

	/**
	 * Crea una nueva categoría en el sistema.
	 *
	 * @param categoryData - Datos parciales de la categoría a crear
	 * @returns Categoría creada con su ID asignado
	 */
	async create(categoryData: Partial<ICategory>): Promise<ICategory> {
		const category = new CategoryModel(categoryData);
		return category.save();
	}

	/**
	 * Actualiza una categoría existente.
	 *
	 * @param id - ID de la categoría a actualizar
	 * @param categoryData - Datos parciales a actualizar
	 * @returns Categoría actualizada o null si no existe
	 */
	async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
		return CategoryModel.findByIdAndUpdate(id, categoryData, { new: true }).exec();
	}

	/**
	 * Elimina una categoría del sistema.
	 *
	 * @param id - ID de la categoría a eliminar
	 * @returns Categoría eliminada o null si no existe
	 */
	async delete(id: string): Promise<ICategory | null> {
		return CategoryModel.findByIdAndDelete(id).exec();
	}
}

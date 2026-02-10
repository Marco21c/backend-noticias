import type { ICategory } from '../interfaces/category.interface.js';
import CategoryModel from '../models/category.model.js';

/**
 * CategoryRepository - Capa de acceso a datos para Categories
 * Responsabilidad: Solo operaciones CRUD con la base de datos
 */
export class CategoryRepository {
	/**
	 * Obtener todas las categorias
	 */
	async findAll(): Promise<ICategory[]> {
		return CategoryModel.find().exec();
	}

	/**
	 * Buscar categoria por ID
	 */
	async findById(id: string): Promise<ICategory | null> {
		return CategoryModel.findById(id).exec();
	}

	/**
	 * Buscar categoria por nombre (case insensitive)
	 */
	async findByName(name: string): Promise<ICategory | null> {
		const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const nameRegex = new RegExp('^' + escaped + '$', 'i');
		return CategoryModel.findOne({ name: { $regex: nameRegex } }).exec();
	}

	/**
	 * Crear una nueva categoria
	 */
	async create(categoryData: Partial<ICategory>): Promise<ICategory> {
		const category = new CategoryModel(categoryData);
		return category.save();
	}

	/**
	 * Actualizar una categoria existente
	 */
	async update(id: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
		return CategoryModel.findByIdAndUpdate(id, categoryData, { new: true }).exec();
	}

	/**
	 * Eliminar una categoria
	 */
	async delete(id: string): Promise<ICategory | null> {
		return CategoryModel.findByIdAndDelete(id).exec();
	}
}

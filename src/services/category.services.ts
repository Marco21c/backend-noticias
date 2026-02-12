import type { ICategory } from '../interfaces/category.interface.js';
import { CategoryRepository } from '../repositories/category.repository.js';
import type { CreateCategoryInput, UpdateCategoryInput } from '../validations/category.schemas.js';
import { cleanUndefined } from '../helpers/cleanUndefined.js';
/**
 * CategoryService - Capa de lógica de negocio para Categories
 * Responsabilidad: Reglas de negocio, transformaciones
 * NO valida formatos (eso lo hace Zod en el middleware)
 */
export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository || new CategoryRepository();
    }

    /**
     * Obtener todas las categorías
     */
    async getAllCategories(): Promise<ICategory[]> {
        return this.categoryRepository.findAll();
    }

    /**
     * Obtener categoría por ID
     */
    async getCategoryById(id: string): Promise<ICategory | null> {
        return this.categoryRepository.findById(id);
    }

    /**
     * Crear una nueva categoría
     * @param categoryData - Datos validados por Zod (futuro: CreateCategoryDto)
     */
    async createCategory(categoryData: CreateCategoryInput): Promise<ICategory> {
        const { name, description, isActive } = categoryData;

        // REGLA DE NEGOCIO: Nombre único
        const existing = await this.categoryRepository.findByName(name);
        if (existing) {
            throw new Error('NAME_DUPLICATE');
        }

        return this.categoryRepository.create({
            name,
            description,
            isActive
        });
    }

    /**
     * Editar una categoría existente
     * @param id - ID de la categoría a actualizar
     * @param categoryData - Datos validados por Zod (futuro: UpdateCategoryDto)
     */
    async updateCategory(id: string, categoryData: UpdateCategoryInput): Promise<ICategory | null> {
        // REGLA DE NEGOCIO: Nombre único (si se está actualizando)
        if (categoryData.name) {
            const existing = await this.categoryRepository.findByName(categoryData.name);
            if (existing && existing._id?.toString() !== id) {
                throw new Error('NAME_DUPLICATE');
            }
        }

        // Limpiar undefined con helper
        const updatePayload = cleanUndefined(categoryData) as Partial<ICategory>;

        return this.categoryRepository.update(id, updatePayload);
    }

    /**
     * Eliminar una categoría
     */
    async deleteCategory(id: string): Promise<ICategory | null> {
        return this.categoryRepository.delete(id);
    }

}
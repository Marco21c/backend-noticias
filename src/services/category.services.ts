import type { CreateCategoryRequestDto, UpdateCategoryRequestDto } from '../dtos/category.dto.js';
import { cleanUndefined } from '../helpers/cleanUndefined.js';
import type { ICategory } from '../interfaces/category.interface.js';
import { CategoryRepository } from '../repositories/category.repository.js';
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
     * Retorna todas las categorias activas/inactivas sin filtros
     * @returns {Promise<ICategory[]>} Lista completa de categorias
     */
    async getAllCategories(): Promise<ICategory[]> {
        return this.categoryRepository.findAll();
    }

    /**
     * Retorna un objeto modelo de Category por su object ID
     * @param {string} id
     * @returns {Promise<ICategory | null>} El modelo o null si fue borrado o no existe
     */
    async getCategoryById(id: string): Promise<ICategory | null> {
        return this.categoryRepository.findById(id);
    }

    /**
     * Crea un espacio de categorias global verficando que el nombre no la pise con otra.
     * @param {CreateCategoryRequestDto} categoryData - Zod Payload de creacion
     * @throws {Error} NAME_DUPLICATE
     * @returns {Promise<ICategory>} modelo de la bbdd recien inyectado
     */
    async createCategory(categoryData: CreateCategoryRequestDto): Promise<ICategory> {
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
     * Update parcial de una category verificando que el nombre reinyectado no colisione con otra.
     * @param {string} id Mongo ID
     * @param {UpdateCategoryRequestDto} categoryData Parametros de actualizacion como `{"isActive": false}`
     * @throws {Error} NAME_DUPLICATE
     * @returns {Promise<ICategory | null>} Modelo post update de la bd
     */
    async updateCategory(id: string, categoryData: UpdateCategoryRequestDto): Promise<ICategory | null> {
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
     * Da de baja el item category completo. (Precaución, puede desatar on cascades a links sueltos).
     * @param {string} id Unico del target
     * @returns {Promise<ICategory | null>} Return model borrado.
     */
    async deleteCategory(id: string): Promise<ICategory | null> {
        return this.categoryRepository.delete(id);
    }

}
import type { IPaginationOptions, IPaginatedResponse } from '../interfaces/pagination.interface.js';
import type { IUser } from '../interfaces/user.interface.js';
import UserModel from '../models/user.model.js';

/**
 * User repository for database operations.
 * Handles all CRUD operations for User entities.
 * 
 * @example
 * ```typescript
 * const userRepository = new UserRepository();
 * const user = await userRepository.findByEmail('user@example.com');
 * ```
 */
export class UserRepository {
	/**
	 * Retrieves all users from the database.
	 * @param selectFields - Optional fields to select (e.g., '-password')
	 * @returns Array of users
	 */
	async findAll(selectFields?: string): Promise<IUser[]> {
		const query = UserModel.find();
		if (selectFields) {
			query.select(selectFields);
		}
		return query.exec();
	}

	/**
	 * Retrieves paginated users from the database.
	 * @param options - Pagination options (page, limit)
	 * @param selectFields - Optional fields to select (e.g., '-password')
	 * @returns Paginated response with users
	 */
	async findAllPaginated(
		options: IPaginationOptions,
		selectFields?: string
	): Promise<IPaginatedResponse<IUser>> {
		const page = Math.max(1, options.page || 1);
		const limit = Math.max(1, Math.min(100, options.limit || 10));
		const skip = (page - 1) * limit;

		const query = UserModel.find();
		if (selectFields) {
			query.select(selectFields);
		}

		const results = await query.skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
		const total = await UserModel.countDocuments().exec();

		return {
			results,
			total,
			page,
			totalPages: Math.ceil(total / limit)
		};
	}

	/**
	 * Finds a user by ID.
	 * @param id - User ID
	 * @param selectFields - Optional fields to select
	 * @returns User or null if not found
	 */
	async findById(id: string, selectFields?: string): Promise<IUser | null> {
		const query = UserModel.findById(id);
		if (selectFields) {
			query.select(selectFields);
		}
		return query.exec();
	}

	/**
	 * Finds a user by email address.
	 * @param email - User email
	 * @returns User or null if not found
	 */
	async findByEmail(email: string): Promise<IUser | null> {
		return UserModel.findOne({ email }).exec();
	}

	/**
	 * Finds a user by email using regex (case insensitive).
	 * @param emailRegex - Regular expression for email matching
	 * @returns User or null if not found
	 */
	async findByEmailRegex(emailRegex: RegExp): Promise<IUser | null> {
		return UserModel.findOne({ email: { $regex: emailRegex } }).exec();
	}

	/**
	 * Creates a new user.
	 * @param userData - User data to create
	 * @returns Created user
	 */
	async create(userData: Partial<IUser>): Promise<IUser> {
		const user = new UserModel(userData);
		return user.save();
	}

	/**
	 * Updates an existing user.
	 * @param id - User ID
	 * @param userData - Data to update
	 * @returns Updated user or null if not found
	 */
	async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
		return UserModel.findByIdAndUpdate(id, userData, { new: true }).exec();
	}

	/**
	 * Deletes a user.
	 * @param id - User ID
	 * @returns Deleted user or null if not found
	 */
	async delete(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}

	/**
	 * Checks if an email already exists (case insensitive).
	 * @param email - Email to check
	 * @param excludeId - Optional user ID to exclude from check
	 * @returns True if email exists, false otherwise
	 */
	async emailExists(email: string, excludeId?: string): Promise<boolean> {
		const escaped = String(email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const emailRegex = new RegExp('^' + escaped + '$', 'i');
		const existing = await UserModel.findOne({ email: { $regex: emailRegex } }).exec();

		if (!existing) return false;
		if (excludeId && existing._id.toString() === excludeId) return false;
		return true;
	}
}

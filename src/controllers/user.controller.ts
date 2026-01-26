import type { Request, Response } from 'express';
import { UserService } from '../services/user.services.js';

export class UserController {
	async getUsers(req: Request, res: Response): Promise<Response> {
		try {
			const users = await new UserService().getAllUsers();
			return res.status(200).json(users);
		} catch (error) {
			return res.status(500).json({ message: 'Error retrieving users', error });
		}
	}

	async createUser(req: Request, res: Response): Promise<Response> {
		try {
			const userData = req.body;
			if (!userData || typeof userData.password !== 'string' || !userData.email) {
				return res.status(400).json({ message: 'Invalid user data' });
			}
			const newUser = await new UserService().createUser(userData);
			return res.status(201).json({ message: 'User created successfully', data: newUser });
		} catch (error) {
			return res.status(500).json({ message: 'Error creating user', error });
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'Invalid user ID' });
			}
			const user = await new UserService().getUserById(id);
			if (!user) return res.status(404).json({ message: 'User not found' });
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Error retrieving user', error });
		}
	}

	async getUserByEmail(req: Request, res: Response): Promise<Response> {
		try {
			const email = req.query.email;
			if (!email || typeof email !== 'string') {
				return res.status(400).json({ message: 'Invalid email' });
			}
			const user = await new UserService().getUserByEmail(email);
			if (!user) return res.status(404).json({ message: 'User not found' });
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Error retrieving user', error });
		}
	}

	async editUser(req: Request, res: Response): Promise<Response> {
		try {
			const idFromParams = req.params.id;
			let id: string | undefined = undefined;

			if (idFromParams && typeof idFromParams === 'string') {
				id = idFromParams;
			} else if (req.query && typeof req.query._id === 'string') {
				id = req.query._id;
			} else if (req.query && Array.isArray(req.query._id) && typeof req.query._id[0] === 'string') {
				id = req.query._id[0];
			}

			const userData = req.body;
			if (!id) return res.status(400).json({ message: 'Invalid user ID' });

			const edited = await new UserService().updateUser(id, userData);
			if (!edited) return res.status(404).json({ message: 'User not found' });

			return res.status(200).json({ message: 'User edited successfully', data: edited });
		} catch (error) {
			return res.status(500).json({ message: 'Error editing user', error });
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'Invalid user ID' });
			}
			const deletedUser = await new UserService().deleteUser(id);
			if (!deletedUser) return res.status(404).json({ message: 'User not found' });
			return res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
		} catch (error) {
			return res.status(500).json({ message: 'Error deleting user', error });
		}
	}
}

export const userController = new UserController();

import type { Request, Response } from 'express';
import { UserService } from '../services/user.services.js';

export class UserController {
	async getUsers(req: Request, res: Response): Promise<Response> {
		try {
			const users = await new UserService().getAllUsers();
			return res.status(200).json(users);
		} catch (error) {
			return res.status(500).json({ message: 'Error al obtener usuarios', error });
		}
	}

	async createUser(req: Request, res: Response): Promise<Response> {
		try {
			const userData = req.body;
			if (!userData || typeof userData.password !== 'string' || !userData.email) {
				return res.status(400).json({ message: 'Datos de usuario inválidos' });
			}
			const newUser = await new UserService().createUser(userData);
			return res.status(201).json({ message: 'Usuario creado correctamente', data: newUser });
		} catch (error) {
			const err: any = error;
			if (err && err.message === 'EMAIL_DUPLICATE') {
				return res.status(409).json({ message: 'El email ya existe' });
			}
			if (err && err.message === 'INVALID_EMAIL') {
				return res.status(400).json({ message: 'Email inválido' });
			}
			if (err && err.message === 'INVALID_PASSWORD') {
				return res.status(400).json({ message: 'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' });
			}
			return res.status(500).json({ message: 'Error al crear usuario', error });
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de usuario inválido' });
			}
			const user = await new UserService().getUserById(id);
			if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Error al obtener usuario', error });
		}
	}

	async getUserByEmail(req: Request, res: Response): Promise<Response> {
		try {
			const email = req.query.email;
			if (!email || typeof email !== 'string') {
				return res.status(400).json({ message: 'Email inválido' });
			}
			const user = await new UserService().getUserByEmail(email);
			if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Error al obtener usuario', error });
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
			if (!id) return res.status(400).json({ message: 'ID de usuario inválido' });

			try {
				const edited = await new UserService().updateUser(id, userData);
				if (!edited) return res.status(404).json({ message: 'Usuario no encontrado' });

				return res.status(200).json({ message: 'Usuario editado correctamente', data: edited });
			} catch (err: any) {
				if (err && err.message === 'EMAIL_DUPLICATE') return res.status(409).json({ message: 'El email ya existe' });
				if (err && err.message === 'INVALID_EMAIL') return res.status(400).json({ message: 'Email inválido' });
				if (err && err.message === 'INVALID_PASSWORD') return res.status(400).json({ message: 'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' });
				throw err;
			}
		} catch (error) {
			return res.status(500).json({ message: 'Error al editar usuario', error });
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de usuario inválido' });
			}
			const deletedUser = await new UserService().deleteUser(id);
			if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json({ message: 'Usuario eliminado correctamente', data: deletedUser });
		} catch (error) {
			return res.status(500).json({ message: 'Error al eliminar usuario', error });
		}
	}
}

export const userController = new UserController();

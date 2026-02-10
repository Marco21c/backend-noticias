import type { Request, Response } from 'express';
import { UserService } from '../services/user.services.js';

/**
 * UserController - Capa de presentación/API
 * Responsabilidad: Orquestar requests/responses HTTP
 */
export class UserController {
	private userService: UserService;

	constructor(userService?: UserService) {
		this.userService = userService || new UserService();
		
		// Vincular métodos al contexto de la clase
		this.getUsers = this.getUsers.bind(this);
		this.createUser = this.createUser.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.getUserByEmail = this.getUserByEmail.bind(this);
		this.editUser = this.editUser.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
	}

	async getUsers(req: Request, res: Response): Promise<Response> {
		try {
			const users = await this.userService.getAllUsers();
			return res.status(200).json(users);
		} catch (error) {
			console.error('Error en getUsers:', error);
			return res.status(500).json({ 
				message: 'Error al obtener usuarios', 
				error: error instanceof Error ? error.message : 'Error desconocido' 
			});
		}
	}

	async createUser(req: Request, res: Response): Promise<Response> {
		try {
			const userData = req.body;
			const newUser = await this.userService.createUser(userData);
			return res.status(201).json({ message: 'Usuario creado correctamente', data: newUser });
		} catch (error) {
			const err: any = error;
			if (err && err.message === 'FORBIDDEN_ROLE') {
				return res.status(403).json({ message: 'No se puede crear usuarios con rol superadmin' });
			}
			if (err && err.message === 'EMAIL_DUPLICATE') {
				return res.status(409).json({ message: 'El email ya existe' });
			}
			if (err && err.message === 'INVALID_EMAIL') {
				return res.status(400).json({ message: 'Email inválido' });
			}
			if (err && err.message === 'INVALID_PASSWORD') {
				return res.status(400).json({ message: 'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' });
			}
			console.error('Error en createUser:', error);
		return res.status(500).json({ 
			message: 'Error al crear usuario', 
			error: error instanceof Error ? error.message : 'Error desconocido' 
		});
		}
	}

	async getUserById(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de usuario inválido' });
			}
			const user = await this.userService.getUserById(id);
			if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json(user);
		} catch (error) {
			console.error('Error en getUserById:', error);
			return res.status(500).json({ 
				message: 'Error al obtener usuario', 
				error: error instanceof Error ? error.message : 'Error desconocido' 
			});
		}
	}

	async getUserByEmail(req: Request, res: Response): Promise<Response> {
		try {
			const email = req.query.email;
			if (!email || typeof email !== 'string') {
				return res.status(400).json({ message: 'Email inválido' });
			}
			const user = await this.userService.getUserByEmail(email);
			if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json(user);
		} catch (error) {
			console.error('Error en getUserByEmail:', error);
			return res.status(500).json({ 
				message: 'Error al obtener usuario', 
				error: error instanceof Error ? error.message : 'Error desconocido' 
			});
		}
	}

	async editUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			const userData = req.body;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de usuario inválido' });
			}
			if (!userData || typeof userData !== 'object') {
				return res.status(400).json({ message: 'Datos de usuario inválidos' });
			}

			try {
				const edited = await this.userService.updateUser(id, userData);
				if (!edited) return res.status(404).json({ message: 'Usuario no encontrado' });

				return res.status(200).json({ message: 'Usuario editado correctamente', data: edited });
			} catch (err: any) {
				if (err && err.message === 'FORBIDDEN_ROLE') return res.status(403).json({ message: 'No se puede asignar rol superadmin' });
				if (err && err.message === 'EMAIL_DUPLICATE') return res.status(409).json({ message: 'El email ya existe' });
				if (err && err.message === 'INVALID_EMAIL') return res.status(400).json({ message: 'Email inválido' });
				if (err && err.message === 'INVALID_PASSWORD') return res.status(400).json({ message: 'Contraseña inválida: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' });
				throw err;
			}
		} catch (error) {
			console.error('Error en editUser:', error);
			return res.status(500).json({ 
				message: 'Error al editar usuario', 
				error: error instanceof Error ? error.message : 'Error desconocido' 
			});
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.params;
			if (!id || typeof id !== 'string') {
				return res.status(400).json({ message: 'ID de usuario inválido' });
			}
			const deletedUser = await this.userService.deleteUser(id);
			if (!deletedUser) return res.status(404).json({ message: 'Usuario no encontrado' });
			return res.status(200).json({ message: 'Usuario eliminado correctamente', data: deletedUser });
		} catch (error) {
			console.error('Error en deleteUser:', error);
			return res.status(500).json({ 
				message: 'Error al eliminar usuario', 
				error: error instanceof Error ? error.message : 'Error desconocido' 
			});
		}
	}
}

export const userController = new UserController();

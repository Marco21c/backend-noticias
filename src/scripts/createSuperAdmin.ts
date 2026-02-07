import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../config/database.js';
import UserModel from '../models/user.model.js';

async function createSuperAdmin() {
	try {
		if (mongoose.connection.readyState !== 1) {
			await mongoose.connection.asPromise();
		}

		const existingSuperAdmin = await UserModel.findOne({ role: 'superadmin' }).exec();

		if (existingSuperAdmin) {
			console.log('❌ Ya existe un superadmin en el sistema');
			return;
		}

		const defaultPassword = 'TuContraseñaSegura123!';
		const password = process.env.SUPERADMIN_PASSWORD || defaultPassword;
		const hashedPassword = await bcrypt.hash(password, 10);

		const superAdmin = await UserModel.create({
			name: process.env.SUPERADMIN_NAME || 'Super',
			lastName: process.env.SUPERADMIN_LASTNAME || 'Admin',
			email: process.env.SUPERADMIN_EMAIL || 'superadmin@tunoticias.com',
			password: hashedPassword,
			role: 'superadmin',
			createdAt: new Date(),
		});

		console.log('✅ Superadmin creado exitosamente');
		console.log('Email:', superAdmin.email);
		console.log(`Contraseña: ${password} (cámbiala inmediatamente)`);
	} catch (error) {
		console.error('❌ Error al crear superadmin:', error);
	} finally {
		await mongoose.connection.close();
	}
}

createSuperAdmin();
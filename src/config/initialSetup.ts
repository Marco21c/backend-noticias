import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../config/database.js';
import UserModel from '../models/user.model.js';

/**
 * Inicializa el superadmin automáticamente si INIT_SUPERADMIN=true
 * ⚠️ IMPORTANTE: Después de crear el superadmin, cambia INIT_SUPERADMIN=false
 * para evitar verificaciones innecesarias en cada inicio del servidor.
 */
export async function initializeSystem() {
	if (process.env.INIT_SUPERADMIN !== 'true') return;

	if (mongoose.connection.readyState !== 1) {
		await mongoose.connection.asPromise();
	}

	const superadminExists = await UserModel.findOne({ role: 'superadmin' }).exec();
	if (superadminExists) return;

	// Validar que la contraseña esté configurada
	if (!process.env.SUPERADMIN_PASSWORD) {
		console.error('❌ ERROR: SUPERADMIN_PASSWORD no está configurada en .env');
		console.error('   Agrega SUPERADMIN_PASSWORD en tu archivo .env antes de continuar.');
		process.exit(1);
	}

	const hashedPassword = await bcrypt.hash(
		process.env.SUPERADMIN_PASSWORD,
		10
	);

	await UserModel.create({
		name: process.env.SUPERADMIN_NAME || 'Super',
		lastName: process.env.SUPERADMIN_LASTNAME || 'Admin',
		email: process.env.SUPERADMIN_EMAIL || 'superadmin@tunoticias.com',
		password: hashedPassword,
		role: 'superadmin',
	});

	console.log('✅ Superadmin inicializado');
}
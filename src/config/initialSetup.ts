import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import '../config/database.js';
import UserModel from '../models/user.model.js';

export async function initializeSystem() {
	if (process.env.INIT_SUPERADMIN !== 'true') return;

	if (mongoose.connection.readyState !== 1) {
		await mongoose.connection.asPromise();
	}

	const superadminExists = await UserModel.findOne({ role: 'superadmin' }).exec();
	if (superadminExists) return;

	const hashedPassword = await bcrypt.hash(
		process.env.SUPERADMIN_PASSWORD || '_defaultPassword123',
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
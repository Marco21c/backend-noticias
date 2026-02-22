import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import '../config/database.js';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * CLI script to create a superadmin user.
 * Requires SUPERADMIN_PASSWORD in .env file.
 * 
 * Usage: npm run create-superadmin
 */
async function createSuperAdmin() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    const existingSuperAdmin = await UserModel.findOne({ role: 'superadmin' }).exec();

    if (existingSuperAdmin) {
      logger.info('A superadmin already exists in the system');
      return;
    }

    if (!process.env.SUPERADMIN_PASSWORD) {
      logger.error('SUPERADMIN_PASSWORD is not configured');
      logger.error('Configure SUPERADMIN_PASSWORD in .env before running this script.');
      process.exit(1);
    }

    const password = process.env.SUPERADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await UserModel.create({
      name: process.env.SUPERADMIN_NAME || 'Super',
      lastName: process.env.SUPERADMIN_LASTNAME || 'Admin',
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@tunoticias.com',
      password: hashedPassword,
      role: 'superadmin',
      createdAt: new Date(),
    });

    logger.info('Superadmin created successfully');
    logger.info(`Email: ${superAdmin.email}`);
    logger.info(`Password: ${password} (change it immediately)`);
  } catch (error) {
    logger.error({ error }, 'Error creating superadmin');
  } finally {
    await mongoose.connection.close();
  }
}

createSuperAdmin();
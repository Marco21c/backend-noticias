import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import '../config/database.js';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * Initializes the superadmin automatically if INIT_SUPERADMIN=true.
 * After creating the superadmin, set INIT_SUPERADMIN=false to avoid
 * unnecessary checks on every server startup.
 */
export async function initializeSystem() {
  if (process.env.INIT_SUPERADMIN !== 'true') return;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connection.asPromise();
  }

  const superadminExists = await UserModel.findOne({ role: 'superadmin' }).exec();
  if (superadminExists) return;

  if (!process.env.SUPERADMIN_PASSWORD) {
    logger.error('SUPERADMIN_PASSWORD is not configured in .env');
    logger.error('Add SUPERADMIN_PASSWORD to your .env file before continuing.');
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

  logger.info('Superadmin initialized');
}
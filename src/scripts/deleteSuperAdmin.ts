import mongoose from 'mongoose';

import '../config/database.js';
import UserModel from '../models/user.model.js';
import logger from '../utils/logger.js';

/**
 * CLI script to delete the superadmin user from the database.
 * Useful for testing or development reset.
 * 
 * Usage: npm run delete-superadmin
 */
async function deleteSuperAdmin() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    const result = await UserModel.deleteOne({ role: 'superadmin' });

    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} superadmin`);
    } else {
      logger.info('No superadmin found to delete');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error deleting superadmin');
    await mongoose.connection.close();
    process.exit(1);
  }
}

deleteSuperAdmin();

import mongoose from 'mongoose';
import '../config/database.js';
import UserModel from '../models/user.model.js';

/**
 * Script para eliminar el superadmin de la base de datos
 * Útil para testing o reset de desarrollo
 * 
 * Uso: npm run delete-superadmin
 */

async function deleteSuperAdmin() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connection.asPromise();
    }

    const result = await UserModel.deleteOne({ role: 'superadmin' });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Eliminado ${result.deletedCount} superadmin`);
    } else {
      console.log('ℹ️  No se encontró ningún superadmin para eliminar');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

deleteSuperAdmin();

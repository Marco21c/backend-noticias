import dotenv from 'dotenv';
import { z, ZodError } from 'zod';

// Cargar variables de entorno (solo una vez)
dotenv.config();

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Entorno
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Puertos
  PORT: z.coerce.number().int().positive().default(3000),
  PORT_DEV: z.coerce.number().int().positive().optional(),
  PORT_PROD: z.coerce.number().int().positive().optional(),
  
  // Base de datos
  MONGODB_URI: z.url('MONGODB_URI debe ser una URL válida'),
  
  // URLs del frontend (consistencia con otros archivos)
  FRONTEND_URL: z.url().optional(),
  FRONTEND_DEV_URL: z.url().default('http://localhost:5173'),
  CLIENT_URL: z.url().optional(),
  CLIENT_DEV_URL: z.url().optional(),
  APP_URL: z.url().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres').optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

// Validar y exportar con manejo de errores
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ Error de validación en variables de entorno:');
      error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        console.error(`  - ${path || 'raíz'}: ${issue.message}`);
      });
      console.error('\n💡 Asegúrate de configurar todas las variables requeridas en tu archivo .env');
      process.exit(1);
    }
    throw error;
  }
}

const env = validateEnv();
export default env;
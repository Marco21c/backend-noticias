import dotenv from 'dotenv';
import { z, ZodError } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Puertos
  PORT: z.coerce.number().int().positive().default(3000),
  PORT_DEV: z.coerce.number().int().positive().optional(),
  PORT_PROD: z.coerce.number().int().positive().optional(),
  
  // Base de datos
  MONGODB_URI: z.string().optional(), // Producción
  MONGODB_DEV: z.string().optional(), // Desarrollo
  
  // URLs
  CLIENT_URL: z.string().optional(),
  CLIENT_DEV_URL: z.string().optional(),
  APP_URL: z.string().optional(),
  
  // JWT
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Superadmin
  INIT_SUPERADMIN: z.string().optional(),
  SUPERADMIN_NAME: z.string().optional(),
  SUPERADMIN_LASTNAME: z.string().optional(),
  SUPERADMIN_EMAIL: z.string().optional(),
  SUPERADMIN_PASSWORD: z.string().optional(),
}).refine(
  (data) => {
    // Validar que exista MONGODB_URI en producción o MONGODB_DEV en desarrollo
    if (data.NODE_ENV === 'production') {
      return !!data.MONGODB_URI;
    }
    return !!data.MONGODB_DEV;
  },
  {
    message: 'Se requiere MONGODB_URI en producción o MONGODB_DEV en desarrollo',
  }
);

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
      console.error('\n💡 Revisa tu archivo .env');
      process.exit(1);
    }
    throw error;
  }
}

const env = validateEnv();
export default env;
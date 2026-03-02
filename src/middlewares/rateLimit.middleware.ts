import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Demasiados intentos de inicio de sesión. Intente de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Demasiadas solicitudes. Intente de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

import type { CorsOptions } from 'cors';

/**
 * CORS configuration for the API.
 * Allows requests from configured client URLs in development and production.
 * Permits tools like Postman and curl (no origin) in all environments.
 */
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.CLIENT_DEV_URL,
            process.env.APP_URL,
        ];

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error(`${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;


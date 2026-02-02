import type { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // * Origenes permitidos
        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.CLIENT_DEV_URL,
            process.env.APP_URL,
        ];

        // * Si no hay origen, se permite Postman, curl, etc.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback (new Error(`${origin} Not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;


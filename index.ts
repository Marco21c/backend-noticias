import express from 'express';
import cors from 'cors';
import corsOptions from './src/config/cors.js';
import './src/config/database.js';
import mainRouter from './src/routes/main.routes.js';
import env from './src/config/env.js';

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (env.PORT_PROD || env.PORT) : (env.PORT_DEV || env.PORT);

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', mainRouter);


// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});


export default app;

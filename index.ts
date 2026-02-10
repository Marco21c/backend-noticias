import express from 'express';
import cors from 'cors';
import corsOptions from './src/config/cors.js';
import './src/config/database.js';
import mainRouter from './src/routes/main.routes.js';
import env from './src/config/env.js';
import { initializeSystem } from './src/config/initialSetup.js';
import { notFound, errorHandler } from './src/middlewares/error.middleware.ts';


const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (env.PORT_PROD || env.PORT) : (env.PORT_DEV || env.PORT);

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use('/api', mainRouter); 

// Middlewares de error
app.use(notFound);
app.use(errorHandler);


// Inicio del servidor
async function startServer() {
  try {
    await initializeSystem();
  } catch (error) {
    console.error('❌ Error en la inicialización del sistema:', error);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer();


export default app;

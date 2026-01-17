import express from 'express';
import cors from 'cors';
import './src/config/database.ts';
import dotenv from 'dotenv';
import mainRouter from './src/routes/main.routes.ts';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/api', mainRouter);

// Puerto
app.set('port', PORT);

// Inicio del servidor
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});

import express from 'express';
import cors from 'cors';
import './config/database.ts';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors())

// Puerto
app.set('port', process.env.PORT || 3000);

// Inicio del servidor
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});

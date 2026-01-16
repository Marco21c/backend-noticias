import express from 'express';
import cors from 'cors';
import './config/database.ts';
import dotenv from 'dotenv';
import noticiaRouter from './routes/noticia.route.ts';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors())
app.use('/', noticiaRouter);

// Puerto
app.set('port', PORT);

// Inicio del servidor
app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
});

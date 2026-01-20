import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.MONGODB_URI || 'mongodb://localhost/noticiasdb';

mongoose
  .connect(URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

export default mongoose;

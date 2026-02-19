import mongoose from 'mongoose';
import env from './env.js';

const URI = env.NODE_ENV === 'production'
  ? env.MONGODB_URI
  : env.MONGODB_DEV || "mongodb://localhost:1515/noticiasdb";

console.log(`Conectando a MongoDB en modo: ${process.env.NODE_ENV}`);
console.log(`URI: ${URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Oculta credenciales en logs

mongoose
  .connect(URI!)
  .then(() => console.log('✅ Database connected'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

export default mongoose;
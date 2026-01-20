import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI 
  : process.env.MONGODB_DEV || "mongodb://localhost:1515/noticiasdb";

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
import mongoose from 'mongoose';

import logger from '../utils/logger.js';

import env from './env.js';

const URI = env.NODE_ENV === 'production'
  ? env.MONGODB_URI
  : env.MONGODB_DEV || "mongodb://localhost:27017/noticiasdb";

logger.info({ mode: env.NODE_ENV }, 'Connecting to MongoDB');

mongoose
  .connect(URI!)
  .then(() => logger.info('Database connected'))
  .catch(err => {
    logger.error({ err }, 'Error connecting to MongoDB');
    process.exit(1);
  });

export default mongoose;
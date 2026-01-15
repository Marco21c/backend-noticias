import mongoose from 'mongoose';

const URI = 'mongodb://localhost/noticiasdb';

mongoose
  .connect(URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

export default mongoose;

import app from './app';
import { connectDB } from './config/database';

const PORT = process.env._PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

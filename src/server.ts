import { configDotenv } from 'dotenv';
import { connectDB } from './config/database.config';
import server from './app';
configDotenv();
const PORT = process.env._PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

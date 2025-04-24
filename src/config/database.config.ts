import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
configDotenv();

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env._MONGO_URI as string);
    console.log('🍃 MongoDB connected');
  } catch (error) {
    console.error('Database error:', (error as Error).message);
  }
}

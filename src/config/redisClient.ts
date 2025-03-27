import { configDotenv } from 'dotenv';
import { Redis } from 'ioredis';
configDotenv();
const redisClient = new Redis(process.env._REDIS_URL as string);

redisClient.on('connect', () => {
  console.log('🍃 Redis connected');
});
redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});
process.on('SIGINT', async () => {
  console.log('Closing Redis connection...');
  await redisClient.quit();
  process.exit(0);
});

export default redisClient;

import { Redis } from 'ioredis';

const redisClient = new Redis();

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

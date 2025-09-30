import { Redis } from 'ioredis';
const redisUrl = process.env._REDIS_URL || 'redis://localhost:6379';
const redisClientConfig = new Redis(redisUrl);

redisClientConfig.on('connect', () => {
  console.log('🍃 Redis connected');
});
redisClientConfig.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});
process.on('SIGINT', async () => {
  console.log('Closing Redis connection...');
  await redisClientConfig.quit();
  process.exit(0);
});

export default redisClientConfig;

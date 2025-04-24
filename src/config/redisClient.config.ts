import { Redis } from 'ioredis';

const redisClientConfig = new Redis();

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

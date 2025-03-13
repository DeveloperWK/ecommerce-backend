import { Redis } from 'ioredis';
const redisClient = new Redis();

redisClient.on('connect', () => {
  console.log('🍃 Redis connected');
});
redisClient.on('error', () => {
  console.error('❌ Redis not connected');
});

export default redisClient;

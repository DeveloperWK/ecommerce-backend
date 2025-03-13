import redisClient from '../config/redisClient';
const cacheData = async (
  key: string,
  data: any,
  ttl: number = 3600,
): Promise<void> => {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis error:', error);
  }
};
const getCacheData = async (key: string) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};
export { cacheData, getCacheData };

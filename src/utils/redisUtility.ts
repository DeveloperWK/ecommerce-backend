import redisClientConfig from '../config/redisClient.config';
const cacheData = async (
  key: string,
  data: any,
  ttl: number = 3600,
): Promise<void> => {
  try {
    await redisClientConfig.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis error:', error);
  }
};
const getCacheData = async (key: string) => {
  const data = await redisClientConfig.get(key);
  return data ? JSON.parse(data) : null;
};
export { cacheData, getCacheData };

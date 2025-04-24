import redisClientConfig from '../config/redisClient.config';

const deleteProductKeysFromRedis = async () => {
  try {
    const keys = await redisClientConfig.keys('products:*');
    if (keys.length > 0) {
      await redisClientConfig.del(keys);
    }
  } catch (error) {
    console.error('Error deleting Redis keys:', error);
  }
};
export default deleteProductKeysFromRedis;

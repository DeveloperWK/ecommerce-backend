import redisClientConfig from '../config/redisClient.config';

const deleteProductKeysFromRedis = async () => {
  try {
    const keys = await redisClientConfig.keys('products:*');

    if (keys.length > 0) {
      await redisClientConfig.del(...keys);
      console.log('Redis keys deleted successfully');
    } else {
      console.log('No matching Redis keys found');
    }
  } catch (error) {
    console.error('Error deleting Redis keys:', error);
  }
};

export default deleteProductKeysFromRedis;

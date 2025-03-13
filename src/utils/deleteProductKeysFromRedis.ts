import redisClient from '../config/redisClient';

const deleteProductKeysFromRedis = async () => {
  try {
    const keys = await redisClient.keys('products:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log('Redis keys deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting Redis keys:', error);
  }
};
export default deleteProductKeysFromRedis;

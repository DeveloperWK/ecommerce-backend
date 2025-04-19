import redisClient from '../config/redisClient';

const deleteProductKeysFromRedis = async () => {
  try {
    const keys = await redisClient.keys('products:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Error deleting Redis keys:', error);
  }
};
export default deleteProductKeysFromRedis;

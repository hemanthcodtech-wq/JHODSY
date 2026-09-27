const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

let isConnected = false;

redisClient.on('error', err => {
  console.log('Redis Client Error:', err.message);
  isConnected = false;
});

redisClient.on('connect', () => {
  isConnected = true;
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis, running without cache...');
    isConnected = false;
  }
})();

// Export a safe wrapper so routes don't crash if Redis is unavailable
const safeRedisClient = {
  get: async (key) => {
    if (!isConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (e) {
      return null;
    }
  },
  setEx: async (key, seconds, value) => {
    if (!isConnected) return;
    try {
      await redisClient.setEx(key, seconds, value);
    } catch (e) {}
  },
  del: async (key) => {
    if (!isConnected) return;
    try {
      await redisClient.del(key);
    } catch (e) {}
  }
};

module.exports = safeRedisClient;

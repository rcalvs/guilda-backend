const redis = require('../config/redisClient');

// List all yellow records
exports.getAllYellow = async (req, res) => {
  try {
    const keys = await redis.keys('yellow:*');
    
    if (!keys || keys.length === 0) {
      return res.json([]);
    }

    const values = await redis.call('JSON.MGET', ...keys, '$');

    const yellows = values
      .filter(val => val !== null && val !== undefined)
      .map(val => {
        try {
          const yellow = typeof val === 'string' ? JSON.parse(val) : val;
          
          const data = Array.isArray(yellow) ? yellow[0] : yellow;
          
          if (data && data.id !== undefined) {
            const { id, ...rest } = data;
            return rest;
          }
          return data;
        } catch (parseError) {
          return null;
        }
      })
      .filter(item => item !== null && item !== undefined);
    
    res.json(yellows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching yellow data.' });
  }
};

const redis = require('../config/redisClient');

// Upload de dados da guilda
exports.upload = async (req, res) => {
  try {
    const data = req.body;
    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Body deve ser um array de objetos.' });
    }

    // Salvar cada item no Redis com chave guilda:{id}
    const savedItems = [];
    for (const item of data) {
      if (!item.id) {
        continue; // Pular itens sem ID
      }
      
      const key = `guilda:${item.id}`;
      await redis.set(key, JSON.stringify(item));
      savedItems.push(item);
    }

    res.status(201).json({ 
      message: 'Dados salvos com sucesso.',
      saved: savedItems.length,
      total: data.length
    });
  } catch (err) {
    console.error('Erro ao fazer upload dos dados:', err);
    res.status(500).json({ error: 'Erro ao salvar dados da guilda.' });
  }
};

// Buscar dados salvos
exports.dataReceive = async (req, res) => {
  try {
    const keys = await redis.keys('guilda:*');
    
    if (!keys || keys.length === 0) {
      return res.json([]);
    }

    // Buscar todos os valores
    const values = await redis.mget(keys);
    
    const guildData = values
      .filter(val => val !== null && val !== undefined)
      .map(val => {
        try {
          return JSON.parse(val);
        } catch (parseError) {
          return null;
        }
      })
      .filter(item => item !== null);

    res.json(guildData);
  } catch (err) {
    console.error('Erro ao buscar dados da guilda:', err);
    res.status(500).json({ error: 'Erro ao buscar dados da guilda.' });
  }
};


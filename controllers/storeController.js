const redis = require('../config/redisClient');
const { v4: uuidv4 } = require('uuid');

exports.createStore = async (req, res) => {
  try {
    const id = uuidv4();
    const store = { id, ...req.body };
    await redis.set(`store:${id}`, JSON.stringify(store));
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar loja.' });
  }
};

exports.getAllStore = async (req, res) => {
  try {
    const keys = await redis.keys('store:*');
    const values = await redis.mget(keys);

    const stores = values.map(val => {
      const store = JSON.parse(val);
      const { id, ...rest } = store;
      return rest;
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lojas.' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await redis.get(`store:${req.params.id}`);
    if (!store) return res.status(404).json({ error: 'loja não encontrstoreo.' });
    res.json(JSON.parse(store));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar loja.' });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await redis.get(`store:${req.params.id}`);
    if (!store) return res.status(404).json({ error: 'loja não encontrstoreo.' });

    const updatedstore = { ...JSON.parse(store), ...req.body };
    await redis.set(`store:${req.params.id}`, JSON.stringify(updatedstore));
    res.json(updatedstore);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar loja.' });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const deleted = await redis.del(`store:${req.params.id}`);
    if (!deleted) return res.status(404).json({ error: 'loja não encontrstoreo.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar loja.' });
  }
};

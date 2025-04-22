const redis = require('../config/redisClient');
const { v4: uuidv4 } = require('uuid');

exports.createRift = async (req, res) => {
  try {
    const id = uuidv4();
    const store = { id, ...req.body };
    await redis.set(`rift:${id}`, JSON.stringify(store));
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar rift.' });
  }
};

exports.getAllRift = async (req, res) => {
  try {
    const keys = await redis.keys('rift:*');
    const values = await redis.mget(keys);

    const rifts = values.map(val => {
      const rift = JSON.parse(val);
      const { id, ...rest } = rift;
      return rest;
    });

    res.json(rifts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar rifts.' });
  }
};

exports.getRiftById = async (req, res) => {
  try {
    const store = await redis.get(`rift:${req.params.id}`);
    if (!store) return res.status(404).json({ error: 'rift não encontrstoreo.' });
    res.json(JSON.parse(store));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar rift.' });
  }
};

exports.updateRift = async (req, res) => {
  try {
    const store = await redis.get(`rift:${req.params.id}`);
    if (!store) return res.status(404).json({ error: 'rift não encontrstoreo.' });

    const updatedstore = { ...JSON.parse(store), ...req.body };
    await redis.set(`store:${req.params.id}`, JSON.stringify(updatedstore));
    res.json(updatedstore);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar rift.' });
  }
};

exports.deleteRift = async (req, res) => {
  try {
    const deleted = await redis.del(`store:${req.params.id}`);
    if (!deleted) return res.status(404).json({ error: 'rift não encontrstoreo.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar rift.' });
  }
};

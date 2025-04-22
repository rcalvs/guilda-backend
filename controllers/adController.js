const redis = require('../config/redisClient');
const { v4: uuidv4 } = require('uuid');

// Criar anúncio
exports.createAd = async (req, res) => {
  try {
    const id = uuidv4();
    const ad = { id, ...req.body };
    await redis.set(`ad:${id}`, JSON.stringify(ad));
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar anúncio.' });
  }
};

// Listar todos
exports.getAllAds = async (req, res) => {
  try {
    const keys = await redis.keys('ad:*');
    const values = await redis.mget(keys);

    const ads = values.map(val => {
      const ad = JSON.parse(val);
      const { id, ...rest } = ad;
      return rest;
    });

    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anúncios.' });
  }
};

// Obter por ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await redis.get(`ad:${req.params.id}`);
    if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado.' });
    res.json(JSON.parse(ad));
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar anúncio.' });
  }
};

// Atualizar
exports.updateAd = async (req, res) => {
  try {
    const ad = await redis.get(`ad:${req.params.id}`);
    if (!ad) return res.status(404).json({ error: 'Anúncio não encontrado.' });

    const updatedAd = { ...JSON.parse(ad), ...req.body };
    await redis.set(`ad:${req.params.id}`, JSON.stringify(updatedAd));
    res.json(updatedAd);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar anúncio.' });
  }
};

// Deletar
exports.deleteAd = async (req, res) => {
  try {
    const deleted = await redis.del(`ad:${req.params.id}`);
    if (!deleted) return res.status(404).json({ error: 'Anúncio não encontrado.' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar anúncio.' });
  }
};

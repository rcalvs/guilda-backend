const express = require('express');
const router = express.Router();
const guildController = require('../controllers/guildController');

// Rotas públicas (sem autenticação)
router.post('/upload', guildController.upload);
router.get('/data-receive', guildController.dataReceive);

module.exports = router;


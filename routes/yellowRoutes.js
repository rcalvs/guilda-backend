const express = require('express');
const router = express.Router();
const yellowController = require('../controllers/yellowController');

// Rota pública (sem autenticação)
router.get('/', yellowController.getAllYellow);

module.exports = router;


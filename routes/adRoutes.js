const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');

router.post('/', adController.createAd);
router.get('/', adController.getAllAds);
router.get('/:id', adController.getAdById);
router.put('/:id', adController.updateAd);
router.delete('/:id', adController.deleteAd);

module.exports = router;

const express = require('express');
const router = express.Router();
const riftController = require('../controllers/riftController');

router.post('/', riftController.createRift);
router.get('/', riftController.getAllRift);
router.get('/:id', riftController.getRiftById);
router.put('/:id', riftController.updateRift);
router.delete('/:id', riftController.deleteRift);

module.exports = router;

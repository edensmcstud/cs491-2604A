const express = require('express');
const controller = require('../controllers/salesController');
const router = express.Router();

// Create a new sale (SAL‑S01)
router.post('/', controller.createSale); // TODO Sprint 1

module.exports = router;

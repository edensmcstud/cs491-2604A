const express = require('express');
const controller = require('../controllers/ordersController');
const router = express.Router();

// Create a new customer order (Sprint 2)
router.post('/', controller.createOrder); // TODO Sprint 2

// Get order status (Sprint 2)
router.get('/status/:id', controller.getOrderStatus); // TODO Sprint 2

// Cancel an order (Sprint 2)
router.post('/cancel/:id', controller.cancelOrder); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

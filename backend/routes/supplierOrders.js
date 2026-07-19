const express = require('express');
const controller = require('../controllers/supplierOrdersController');
const router = express.Router();

// Create a supplier restock order (Sprint 2)
router.post('/', controller.createSupplierOrder); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

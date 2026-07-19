const express = require('express');
const controller = require('../controllers/customerAuthController');
const router = express.Router();

// Customer registration (Sprint 2)
router.post('/register', controller.registerCustomer); // TODO Sprint 2

// Customer login (Sprint 2)
router.post('/login', controller.loginCustomer); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

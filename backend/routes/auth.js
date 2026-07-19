const express = require('express');
const controller = require('../controllers/authController');
const router = express.Router();

// Employee login
router.post('/login', controller.login);   // TODO Sprint 1

// Employee logout
router.post('/logout', controller.logout); // TODO Sprint 1

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

const express = require('express');
const controller = require('../controllers/rolesController');
const router = express.Router();

// Update a user's role (Sprint 2)
router.put('/', controller.updateRole); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

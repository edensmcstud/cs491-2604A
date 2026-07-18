const express = require('express');
const controller = require('../controllers/auditController');
const router = express.Router();

// Retrieve audit logs (Sprint 2)
router.get('/', controller.getAuditLogs); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

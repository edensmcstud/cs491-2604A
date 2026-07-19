const express = require('express');
const controller = require('../controllers/reportsController');
const router = express.Router();

// Daily report (Sprint 2)
router.get('/daily', controller.getDailyReport); // TODO Sprint 2

// Weekly report (Sprint 2)
router.get('/weekly', controller.getWeeklyReport); // TODO Sprint 2

// Monthly report (Sprint 2)
router.get('/monthly', controller.getMonthlyReport); // TODO Sprint 2

// Diagnostic
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

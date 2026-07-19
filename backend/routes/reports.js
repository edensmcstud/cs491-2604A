const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportsController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Daily report (auditor)
router.get("/daily", auth, requireRole("auditor"), controller.dailyReport);

// Weekly report (auditor)
router.get("/weekly", auth, requireRole("auditor"), controller.weeklyReport);

// Monthly report (auditor)
router.get("/monthly", auth, requireRole("auditor"), controller.monthlyReport);

// Test route (no auth)
router.get("/test", controller.test);

module.exports = router;

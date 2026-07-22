const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportsController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// All report routes require Admin
router.use(auth);
router.use(requireRole("Admin"));

// Daily report
router.get("/daily", controller.dailyReport);

// Weekly report
router.get("/weekly", controller.weeklyReport);

// Monthly report
router.get("/monthly", controller.monthlyReport);

module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportsController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Test route (no auth)
router.get("/test", controller.test);

// All report routes require authentication
router.use(auth);

// Daily report (Admin + Employee)
router.get(
    "/daily",
    requirePermission("reports", "read"),
    controller.dailyReport
);

// Weekly report (Admin + Employee)
router.get(
    "/weekly",
    requirePermission("reports", "read"),
    controller.weeklyReport
);

// Monthly report (Admin + Employee)
router.get(
    "/monthly",
    requirePermission("reports", "read"),
    controller.monthlyReport
);

module.exports = router;

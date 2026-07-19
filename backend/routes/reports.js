const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportsController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");

router.get("/daily", authEmployee, requireRole("auditor"), controller.dailyReport);
router.get("/weekly", authEmployee, requireRole("auditor"), controller.weeklyReport);
router.get("/monthly", authEmployee, requireRole("auditor"), controller.monthlyReport);
router.get("/test", controller.test);

module.exports = router;

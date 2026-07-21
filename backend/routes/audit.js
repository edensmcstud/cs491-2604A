const express = require("express");
const router = express.Router();

const controller = require("../controllers/auditController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Get audit logs (auditor)
router.get("/", auth, requireRole("auditor"), controller.getAuditLogs);

// Test route (no auth)
router.get("/test", controller.test);

module.exports = router;

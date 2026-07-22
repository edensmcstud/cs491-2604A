const express = require("express");
const router = express.Router();

const controller = require("../controllers/auditController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// All audit routes require Admin
router.use(auth);
router.use(requireRole("Admin"));

// Get audit logs
router.get("/", controller.getAuditLogs);

module.exports = router;

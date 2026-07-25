const express = require("express");
const router = express.Router();

const controller = require("../controllers/auditController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Test route (no auth)
router.get("/test", controller.test);

// All audit routes require authentication
router.use(auth);

// Get audit logs (Admin + Employee)
router.get(
    "/",
    requirePermission("audit", "read"),
    controller.getAuditLogs
);

module.exports = router;

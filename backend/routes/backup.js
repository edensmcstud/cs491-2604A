const express = require("express");
const router = express.Router();

const controller = require("../controllers/backupController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Test route (no auth)
router.get("/test", controller.test);

// All backup/restore routes require authentication
router.use(auth);

// Backup database (Admin + Employee)
router.get(
    "/backup",
    requirePermission("backup", "create"),
    controller.backup
);

// Restore database (Admin + Employee)
router.post(
    "/restore",
    requirePermission("backup", "restore"),
    controller.restore
);

module.exports = router;

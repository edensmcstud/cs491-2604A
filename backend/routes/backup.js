const express = require("express");
const router = express.Router();

const controller = require("../controllers/backupController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// Backup database (admin)
router.get("/backup", auth, requireRole("admin"), controller.backup);

// Restore database (admin)
router.post("/restore", auth, requireRole("admin"), controller.restore);

module.exports = router;

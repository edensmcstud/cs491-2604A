const express = require("express");
const router = express.Router();

const controller = require("../controllers/backupController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// All backup/restore routes require Admin
router.use(auth);
router.use(requireRole("Admin"));

// Backup database
router.get("/backup", controller.backup);

// Restore database
router.post("/restore", controller.restore);

module.exports = router;

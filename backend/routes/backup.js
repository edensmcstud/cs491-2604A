const express = require("express");
const router = express.Router();

const controller = require("../controllers/backupController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");

router.get("/test", controller.test);

router.get("/backup", authEmployee, requireRole("admin"), controller.backup);
router.post("/restore", authEmployee, requireRole("admin"), controller.restore);

module.exports = router;

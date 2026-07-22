const express = require("express");
const router = express.Router();

const controller = require("../controllers/rolesController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Assign role (admin)
router.post("/assign", auth, requireRole("Admin"), controller.assignRole);

// Get roles (admin)
router.get("/", auth, requireRole("Admin"), controller.getRoles);

// Test route (no auth)
router.get("/test", controller.test);

module.exports = router;

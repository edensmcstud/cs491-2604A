const express = require("express");
const router = express.Router();

const controller = require("../controllers/rolesController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Assign role (Admin + Employee)
router.post(
    "/assign",
    auth,
    requirePermission("roles", "assign"),
    controller.assignRole
);

// Get roles (Admin + Employee)
router.get(
    "/",
    auth,
    requirePermission("roles", "read"),
    controller.getRoles
);

// Test route (no auth)
router.get("/test", controller.test);

module.exports = router;

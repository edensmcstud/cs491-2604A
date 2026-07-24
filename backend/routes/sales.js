const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Test route (no auth)
router.get("/test", controller.test);

// All real sales routes require authentication
router.use(auth);

// Create sale (Employee + Admin)
router.post(
    "/",
    requirePermission("sales", "create"),
    controller.createSale
);

// Get sales (Employee + Admin)
router.get(
    "/",
    requirePermission("sales", "read"),
    controller.getSales
);

module.exports = router;

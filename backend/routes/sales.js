const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// Create sale (employee)
router.post("/", auth, requireRole("employee"), controller.createSale);

// Get sales (employee)
router.get("/", auth, requireRole("employee"), controller.getSales);

module.exports = router;

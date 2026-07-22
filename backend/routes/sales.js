const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// All real sales routes require Employee or Admin
router.use(auth);
router.use(requireRole("Employee", "Admin"));

// Create sale
router.post("/", controller.createSale);

// Get sales
router.get("/", controller.getSales);

module.exports = router;

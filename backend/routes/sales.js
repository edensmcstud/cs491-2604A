const express = require("express");
const router = express.Router();

const salesController = require("../controllers/salesController");
const requirePermission = require("../middleware/requirePermission");
const auth = require("../middleware/auth");

// =====================================================
// SALES ROUTES — RBAC OVERHAUL VERSION (Correct)
// =====================================================
// Require authentication for ALL sales routes
router.use(auth);

// -----------------------------------------------------
// CREATE SALE (Employee + Admin)
// -----------------------------------------------------
router.post(
    "/",
    requirePermission("sales", "create"),
    salesController.createSale
);

// -----------------------------------------------------
// READ ALL SALES (Employee + Admin)
// -----------------------------------------------------
router.get(
    "/",
    requirePermission("sales", "read"),
    salesController.getSales
);

module.exports = router;

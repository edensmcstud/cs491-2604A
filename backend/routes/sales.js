const express = require("express");
const router = express.Router();

const salesController = require("../controllers/salesController");
const requirePermission = require("../middleware/requirePermission");

// =====================================================
// SALES ROUTES — RBAC OVERHAUL VERSION (Correct)
// =====================================================

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

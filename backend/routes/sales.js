const express = require("express");
const router = express.Router();

const salesController = require("../controllers/salesController");
const requirePermission = require("../middleware/requirePermission");
const auth = require("../middleware/auth");

// =====================================================
// SALES ROUTES — POS + HISTORY
// =====================================================

// -----------------------------------------------------
// POS SALE (Employee + Admin)
// -----------------------------------------------------
router.post(
    "/pos",
    auth,
    requirePermission("sales", "create"),
    salesController.createPosSale
);

// -----------------------------------------------------
// GET RECEIPT FOR SALE (Employee + Admin)
// (More specific than /:id — MUST come first)
// -----------------------------------------------------
router.get(
    "/:id/receipt",
    auth,
    requirePermission("sales", "read"),
    salesController.getReceipt
);

// -----------------------------------------------------
// READ SINGLE SALE (Employee + Admin)
// (Wildcard — MUST come after /:id/receipt)
// -----------------------------------------------------
router.get(
    "/:id",
    auth,
    requirePermission("sales", "read"),
    salesController.getSale
);

// -----------------------------------------------------
// READ ALL SALES (Employee + Admin)
// (Least specific — MUST come last)
// -----------------------------------------------------
router.get(
    "/",
    auth,
    requirePermission("sales", "read"),
    salesController.getSales
);

module.exports = router;

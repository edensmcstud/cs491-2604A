const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// All inventory routes require authentication
router.use(auth);

// =====================================================
// INVENTORY ROUTES WITH RBAC
// =====================================================

// GET ALL INVENTORY ITEMS
router.get(
    "/",
    requirePermission("inventory", "read"),
    inventoryController.getInventory
);

// GET SINGLE INVENTORY ITEM
router.get(
    "/:id",
    requirePermission("inventory", "read"),
    inventoryController.getInventoryItem
);

// CREATE INVENTORY ITEM (ADMIN ONLY)
router.post(
    "/",
    requirePermission("inventory", "create"),
    inventoryController.createInventoryItem
);

// UPDATE INVENTORY ITEM (ADMIN + EMPLOYEE)
router.put(
    "/:id",
    requirePermission("inventory", "update"),
    inventoryController.updateInventoryItem
);

// ADJUST STOCK LEVELS (ADMIN + EMPLOYEE)
router.patch(
    "/:id/adjust",
    requirePermission("inventory", "adjust"),
    inventoryController.adjustStock
);

// DELETE INVENTORY ITEM (ADMIN ONLY)
router.delete(
    "/:id",
    requirePermission("inventory", "delete"),
    inventoryController.deleteInventoryItem
);

module.exports = router;

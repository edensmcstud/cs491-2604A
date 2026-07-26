const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const requirePermission = require("../middleware/requirePermission");
const auth = require("../middleware/auth");

console.log("inventoryController:", inventoryController);
console.log("requirePermission:", requirePermission);
console.log("auth:", auth);

// Require authentication for ALL inventory routes
router.use(auth);

// -----------------------------------------------------
// READ INVENTORY LIST (Admin + Employee)
// -----------------------------------------------------
router.get(
    "/",
    requirePermission("inventory", "read"),
    inventoryController.getInventory
);

// -----------------------------------------------------
// READ SINGLE INVENTORY ITEM (Admin + Employee)
// -----------------------------------------------------
router.get(
    "/:id",
    requirePermission("inventory", "read"),
    inventoryController.getInventoryItem
);

// -----------------------------------------------------
// UPDATE INVENTORY METADATA (Admin + Employee)
// Replaces values (PUT)
// -----------------------------------------------------
router.put(
    "/:id",
    requirePermission("inventory", "update"),
    inventoryController.updateInventoryItem
);

// -----------------------------------------------------
// ADJUST QUANTITY (Admin + Employee)
// Adds/subtracts from quantity_on_hand (PATCH)
// -----------------------------------------------------
router.patch(
    "/:id/adjust",
    requirePermission("inventory", "adjust"),
    inventoryController.adjustStock
);

module.exports = router;
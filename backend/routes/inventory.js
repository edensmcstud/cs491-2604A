const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// All inventory routes require authentication + Employee or Admin role
router.use(auth);
router.use(requireRole("Employee", "Admin"));

// GET ALL INVENTORY ITEMS
router.get("/", inventoryController.getInventory);

// GET SINGLE INVENTORY ITEM
router.get("/:id", inventoryController.getInventoryItem);

// CREATE INVENTORY ITEM
router.post("/", inventoryController.createInventoryItem);

// UPDATE INVENTORY ITEM
router.put("/:id", inventoryController.updateInventoryItem);

// ADJUST STOCK LEVELS
router.patch("/:id/adjust", inventoryController.adjustStock);

// DELETE INVENTORY ITEM
router.delete("/:id", inventoryController.deleteInventoryItem);

module.exports = router;

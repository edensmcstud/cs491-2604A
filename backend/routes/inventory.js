// routes/inventory.js

const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// All inventory routes require authentication
router.use(auth);

// ===============================
// GET ALL INVENTORY ITEMS
// ===============================
router.get("/", requireRole("manager"), inventoryController.getInventory);

// ===============================
// GET SINGLE INVENTORY ITEM
// ===============================
router.get("/:id", requireRole("manager"), inventoryController.getInventoryItem);

// ===============================
// CREATE INVENTORY ITEM
// ===============================
router.post("/", requireRole("manager"), inventoryController.createInventoryItem);

// ===============================
// UPDATE INVENTORY ITEM
// ===============================
router.put("/:id", requireRole("manager"), inventoryController.updateInventoryItem);

// ===============================
// ADJUST STOCK LEVELS
// ===============================
router.patch("/:id/adjust", requireRole("manager"), inventoryController.adjustStock);

// ===============================
// DELETE INVENTORY ITEM
// ===============================
router.delete("/:id", requireRole("manager"), inventoryController.deleteInventoryItem);

module.exports = router;

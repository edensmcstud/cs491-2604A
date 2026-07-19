const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// Add book to inventory (employee)
router.post("/", auth, requireRole("employee"), controller.addBook);

// Update quantity (employee)
router.put("/:id/quantity", auth, requireRole("employee"), controller.updateQuantity);

// Deactivate book (employee)
router.delete("/:id", auth, requireRole("employee"), controller.deactivateBook);

// Search inventory (employee)
router.get("/search", auth, requireRole("employee"), controller.searchInventory);

module.exports = router;

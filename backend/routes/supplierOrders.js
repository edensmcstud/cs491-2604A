const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierOrdersController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Create supplier order (employee)
router.post("/", auth, requireRole("employee"), controller.createSupplierOrder);

// Get supplier orders (employee)
router.get("/", auth, requireRole("employee"), controller.getSupplierOrders);

// Test route (no auth)
router.get("/test", controller.test);

module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierOrdersController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Test route (no auth)
router.get("/test", controller.test);

// All supplier order routes require authentication
router.use(auth);

// Create supplier order (Employee + Admin)
router.post(
    "/",
    requirePermission("supplier_orders", "create"),
    controller.createSupplierOrder
);

// Get supplier orders (Employee + Admin)
router.get(
    "/",
    requirePermission("supplier_orders", "read"),
    controller.getSupplierOrders
);

module.exports = router;

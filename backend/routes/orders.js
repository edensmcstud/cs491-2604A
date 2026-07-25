const express = require("express");
const router = express.Router();

const controller = require("../controllers/ordersController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");
const requireFields = require("../middleware/requireFields");

// Test route (no auth needed)
router.get("/test", controller.test);

// Create order (Customer only)
router.post(
    "/",
    auth,
    requirePermission("customer_orders", "create"),
    requireFields(["items"]),
    controller.createOrder
);

// Get order status (Customer: own orders only, Employee/Admin: any)
router.get(
    "/:id",
    auth,
    requirePermission("customer_orders", "read"),
    controller.getOrderStatus
);

// Cancel order (Customer: own orders only, Employee/Admin: any)
router.post(
    "/:id/cancel",
    auth,
    requirePermission("customer_orders", "cancel"),
    controller.cancelOrder
);

module.exports = router;

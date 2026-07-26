const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierOrdersController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// Debug logs
console.log("supplierOrders: requirePermission =", requirePermission);
console.log("supplierOrders: controller.receiveSupplierOrder =", controller.receiveSupplierOrder);
console.log(
    "supplierOrders: typeof requirePermission('supplier_orders','receive') =",
    typeof requirePermission("supplier_orders", "receive")
);
console.log(
    "supplierOrders: typeof controller.receiveSupplierOrder =",
    typeof controller.receiveSupplierOrder
);

// -----------------------------------------------------
// TEST ROUTE (no auth)
// -----------------------------------------------------
router.get("/test", controller.test);

// -----------------------------------------------------
// All supplier order routes require authentication
// -----------------------------------------------------
router.use(auth);

// -----------------------------------------------------
// CREATE SUPPLIER ORDER (Employee + Admin)
// -----------------------------------------------------
router.post(
    "/",
    requirePermission("supplier_orders", "create"),
    controller.createSupplierOrder
);

// -----------------------------------------------------
// READ ALL SUPPLIER ORDERS (Employee + Admin)
// -----------------------------------------------------
router.get(
    "/",
    requirePermission("supplier_orders", "read"),
    controller.getSupplierOrders
);

// -----------------------------------------------------
// READ SINGLE SUPPLIER ORDER (Employee + Admin)
// -----------------------------------------------------
router.get(
    "/:id",
    requirePermission("supplier_orders", "read"),
    controller.getSupplierOrderById
);

// -----------------------------------------------------
// RECEIVE SUPPLIER ORDER (Employee + Admin)
// This updates inventory and marks order as Received.
// -----------------------------------------------------
router.patch(
    "/:id/receive",
    requirePermission("supplier_orders", "receive"),
    controller.receiveSupplierOrder
);

module.exports = router;

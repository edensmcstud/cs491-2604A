const express = require("express");
const router = express.Router();

const customerOrdersController = require("../controllers/customerOrdersController");
const requirePermission = require("../middleware/requirePermission");
const requireAuth = require("../middleware/requireAuth");

// =====================================================
// CUSTOMER ORDER ROUTES — RBAC OVERHAUL VERSION
// =====================================================

// -----------------------------------------------------
// CREATE CUSTOMER ORDER (Customer + Employee)
// Customers create their own orders.
// Employees may create orders on behalf of customers.
// Inventory reservation happens in the controller.
// -----------------------------------------------------
router.post(
    "/",
    requirePermission("customer_orders", "create"),
    requireAuth,
    customerOrdersController.createCustomerOrder
);

// -----------------------------------------------------
// READ ALL CUSTOMER ORDERS (Employee + Admin)
// Customers CANNOT access this route.
// -----------------------------------------------------
router.get(
    "/",
    requirePermission("customer_orders", "read"),
    customerOrdersController.getAllCustomerOrders
);

// -----------------------------------------------------
// READ A SINGLE CUSTOMER ORDER
// Employees/Admins: full access
// Customers: only their own orders
// -----------------------------------------------------
router.get(
    "/:id",
    requirePermission("customer_orders", "read"),
    requireAuth,
    customerOrdersController.getCustomerOrderById
);

module.exports = router;

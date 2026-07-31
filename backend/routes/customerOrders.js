const express = require("express");
const router = express.Router();

const customerOrdersController = require("../controllers/customerOrdersController");
const requirePermission = require("../middleware/requirePermission");
const requireAuth = require("../middleware/requireAuth");

// =====================================================
// CUSTOMER ORDER ROUTES � RBAC OVERHAUL VERSION
// =====================================================

// -----------------------------------------------------
// CREATE CUSTOMER ORDER (Customer + Employee)
// Customers create their own orders.
// Employees may create orders on behalf of customers.
// Inventory reservation happens in the controller.
// -----------------------------------------------------
router.post(
    "/",
    requireAuth,
    requirePermission("customer_orders", "create"),
    customerOrdersController.createCustomerOrder
);

// -----------------------------------------------------
// READ ALL CUSTOMER ORDERS (Employee + Admin)
// Customers CANNOT access this route.
// -----------------------------------------------------
router.get(
    "/",
    requireAuth,
    requirePermission("customer_orders", "read"),
    customerOrdersController.getCustomerOrders
);

// -----------------------------------------------------
// READ A SINGLE CUSTOMER ORDER
// Employees/Admins: full access
// Customers: only their own orders
// -----------------------------------------------------
router.get(
    "/:id",
    requireAuth,
    requirePermission("customer_orders", "read"),
    customerOrdersController.getCustomerOrderById
);

module.exports = router;

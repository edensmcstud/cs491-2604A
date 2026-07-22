const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierOrdersController");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

// Test route (no auth)
router.get("/test", controller.test);

// All supplier order routes require Employee or Admin
router.use(auth);
router.use(requireRole("Employee", "Admin"));

// Create supplier order
router.post("/", controller.createSupplierOrder);

// Get supplier orders
router.get("/", controller.getSupplierOrders);

module.exports = router;

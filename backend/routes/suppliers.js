const express = require("express");
const router = express.Router();

const controller = require("../controllers/suppliersController");
const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

// All supplier routes require authentication
router.use(auth);

// Create supplier (Admin + Employee)
router.post(
    "/",
    requirePermission("suppliers", "create"),
    controller.createSupplier
);

// Get all suppliers (Admin + Employee)
router.get(
    "/",
    requirePermission("suppliers", "read"),
    controller.getSuppliers
);

// Get single supplier (Admin + Employee)
router.get(
    "/:id",
    requirePermission("suppliers", "read"),
    controller.getSupplier
);

// Update supplier (Admin + Employee)
router.put(
    "/:id",
    requirePermission("suppliers", "update"),
    controller.updateSupplier
);

// Delete supplier (Admin + Employee)
router.delete(
    "/:id",
    requirePermission("suppliers", "delete"),
    controller.deleteSupplier
);

module.exports = router;

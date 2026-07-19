const express = require("express");
const router = express.Router();

const controller = require("../controllers/supplierOrdersController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

router.post(
    "/",
    authEmployee,
    requireRole("employee"),
    requireFields(["book_id", "quantity"]),
    controller.createSupplierOrder
);

router.get("/", authEmployee, requireRole("employee"), controller.getSupplierOrders);

router.get("/test", controller.test);

module.exports = router;

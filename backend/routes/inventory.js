const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

router.get("/test", controller.test);

router.post(
    "/",
    authEmployee,
    requireRole("employee"),
    requireFields(["isbn", "title", "author", "price", "quantity"]),
    controller.addBook
);

router.put(
    "/:id/quantity",
    authEmployee,
    requireRole("employee"),
    requireFields(["quantity"]),
    controller.updateQuantity
);

router.delete(
    "/:id",
    authEmployee,
    requireRole("employee"),
    controller.deactivateBook
);

router.get("/search", authEmployee, controller.searchInventory);

module.exports = router;

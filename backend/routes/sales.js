const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesController");
const authEmployee = require("../middleware/authEmployee");
const requireRole = require("../middleware/requireRole");
const requireFields = require("../middleware/requireFields");

router.get("/test", controller.test);

router.post(
    "/",
    authEmployee,
    requireRole("employee"),
    requireFields(["book_id", "quantity"]),
    controller.createSale
);

router.get("/", authEmployee, requireRole("employee"), controller.getSales);

module.exports = router;

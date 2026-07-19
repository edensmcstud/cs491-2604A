const express = require("express");
const router = express.Router();

const controller = require("../controllers/ordersController");
const authCustomer = require("../middleware/authCustomer");
const requireFields = require("../middleware/requireFields");

router.get("/test", controller.test);

router.post(
    "/",
    authCustomer,
    requireFields(["items"]),
    controller.createOrder
);

router.get("/:id", authCustomer, controller.getOrderStatus);

router.post("/:id/cancel", authCustomer, controller.cancelOrder);


module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/ordersController");
const auth = require("../middleware/auth");
const requireFields = require("../middleware/requireFields");

router.get("/test", controller.test);

router.post(
    "/",
    auth,
    requireFields(["items"]),
    controller.createOrder
);

router.get("/:id", auth, controller.getOrderStatus);

router.post("/:id/cancel", auth, controller.cancelOrder);

module.exports = router;

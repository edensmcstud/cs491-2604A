const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerAuthController");
const requireFields = require("../middleware/requireFields");

router.post(
    "/register",
    requireFields(["username", "password", "email"]),
    controller.register
);

router.post(
    "/login",
    requireFields(["username", "password"]),
    controller.login
);

router.get("/test", controller.test);

module.exports = router;

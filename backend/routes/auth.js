const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const requireFields = require("../middleware/requireFields");

router.post(
    "/login",
    requireFields(["username", "password"]),
    controller.login
);

router.post("/logout", controller.logout);

router.get("/test", controller.test);

module.exports = router;

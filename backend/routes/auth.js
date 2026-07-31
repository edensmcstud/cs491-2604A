const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const requireFields = require("../middleware/requireFields");
const auth = require("../middleware/auth");

// Customer registration (public)
router.post(
    "/register",
    requireFields([
        "username",
        "password",
        "email",
        "first_name",
        "last_name"
    ]),
    controller.register
);

// Login (public)
router.post(
    "/login",
    requireFields(["username", "password"]),
    controller.login
);

// Logout (authenticated)
router.post(
    "/logout",
    auth,
    controller.logout
);

// Test route (public)
router.get("/test", controller.test);

module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const requireFields = require("../middleware/requireFields");
const auth = require("../middleware/auth");

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

// Register (public)
router.post(
    "/register",
    requireFields(["username", "email", "password", "confirmPassword"]),
    controller.register
);



// Test route (public)
router.get("/test", controller.test);

module.exports = router;

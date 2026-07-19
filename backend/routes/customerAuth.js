const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerAuthController");
const requireFields = require("../middleware/requireFields");
const customerSession = require("../middleware/authCustomer"); // your existing customer session middleware
const { run } = require("../utils/db");

// -----------------------------
// AUTH ROUTES
// -----------------------------
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

// -----------------------------
// PROTECTED ROUTE (for session testing)
// -----------------------------
router.get("/orders", customerSession, async (req, res) => {
    // Return empty list for now; middleware is what we're testing
    res.json([]);
});

// -----------------------------
// EXPIRE SESSION (test helper)
// -----------------------------
router.post("/expire-session/:username", async (req, res) => {
    const { username } = req.params;

    await run(
        `UPDATE customers
         SET session_expires_at = 0
         WHERE username = ?`,
        [username]
    );

    res.json({ message: "Session expired for testing" });
});

router.post("/logout", customerSession, controller.logout);


module.exports = router;

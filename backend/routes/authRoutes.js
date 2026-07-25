const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const requireFields = require("../middleware/requireFields");

// Login (public)
router.post(
    "/login",
    (req, res, next) => {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ error: "Invalid or missing JSON body" });
        }
        next();
    },
    requireFields(["username", "password"]),
    login
);

module.exports = router;

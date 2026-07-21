const handleError = require("../middleware/errorHandler");
const { query, run } = require("../utils/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        await run(
            `INSERT INTO customers (username, password_hash, email)
             VALUES (?, ?, ?)`,
            [username, hashed, email]
        );

        res.json({ message: "Customer registered successfully" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const rows = await query(
            `SELECT id, password_hash
             FROM customers
             WHERE username = ?`,
            [username]
        );

        const customer = rows[0];

        if (!customer) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const valid = await bcrypt.compare(password, customer.password_hash);
        if (!valid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = crypto.randomBytes(32).toString("hex");

        await run(
            `UPDATE customers
             SET session_token = ?, session_expires_at = ?
             WHERE id = ?`,
            [token, Date.now() + 1000 * 60 * 60 * 24, customer.id] // 24 hours
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "customer auth controller test" });
};

exports.logout = async (req, res) => {
    try {
        const customerId = req.customer.id;

        await run(
            `UPDATE customers
             SET session_token = NULL,
                 session_expires_at = NULL
             WHERE id = ?`,
            [customerId]
        );

        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

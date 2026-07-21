const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert user
        const result = await run(
            `INSERT INTO users (username, password_hash, email, is_active)
             VALUES (?, ?, ?, 1)`,
            [username, hashed, email]
        );

        const userId = result.lastID;

        // Assign default role: employee
        await run(
            `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
            [userId, 2] // assuming role_id 2 = employee
        );

        // Audit log
        await logAction(req.user.id, "CREATE", "USER", userId);

        res.json({ message: "User created", user_id: userId });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await query("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        handleError(res, err);
    }
};

exports.getUser = async (req, res) => {
    try {
        const rows = await query(
            "SELECT * FROM users WHERE id = ?",
            [req.params.id]
        );

        res.json(rows[0] || null);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        await run(
            `UPDATE users SET username = ?, email = ? WHERE id = ?`,
            [username, email, req.params.id]
        );

        await logAction(req.user.id, "UPDATE", "USER", req.params.id);

        res.json({ message: "User updated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await run(`UPDATE users SET is_active = 0 WHERE id = ?`, [
            req.params.id,
        ]);

        await logAction(req.user.id, "DEACTIVATE", "USER", req.params.id);

        res.json({ message: "User deactivated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "users controller test" });
};

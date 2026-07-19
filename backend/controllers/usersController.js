const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.createUser = async (req, res) => {
    try {
        const { username, password_hash, email } = req.body;

        const id = await run(
            `INSERT INTO users (username, password_hash, email, is_active)
             VALUES (?, ?, ?, 1)`,
            [username, password_hash, email]
        );

        await logAction(req.user.user_id, "CREATE", "USER", id);

        res.json({ message: "User created", user_id: id });
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
            "SELECT * FROM users WHERE user_id = ?",
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
            `UPDATE users SET username = ?, email = ? WHERE user_id = ?`,
            [username, email, req.params.id]
        );

        await logAction(req.user.user_id, "UPDATE", "USER", req.params.id);

        res.json({ message: "User updated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await run(`UPDATE users SET is_active = 0 WHERE user_id = ?`, [
            req.params.id,
        ]);

        await logAction(req.user.user_id, "DEACTIVATE", "USER", req.params.id);

        res.json({ message: "User deactivated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "users controller test" });
};

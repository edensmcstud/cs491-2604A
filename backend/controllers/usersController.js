const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");
const bcrypt = require("bcrypt");

/**
 * Create a new user
 * Flow:
 * 1. Validate input
 * 2. Hash password
 * 3. Insert into users
 * 4. Assign roles (default or provided)
 * 5. Audit log
 */
exports.createUser = async (req, res) => {
    try {
        const { username, password, email, roles } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "username and password required" });
        }

        const hashed = await bcrypt.hash(password, 10);

        // Insert user
        const result = await run(
            `INSERT INTO users (username, password_hash, email, is_active)
             VALUES (?, ?, ?, 1)`,
            [username, hashed, email]
        );

        const userId = result.lastID;

        // Assign roles (if provided), otherwise default to "employee"
        const roleList = Array.isArray(roles) && roles.length > 0 ? roles : [2];

        for (const roleId of roleList) {
            await run(
                `INSERT INTO user_roles (user_id, role_id)
                 VALUES (?, ?)`,
                [userId, roleId]
            );
        }

        // Audit log
        const actorId = req.user?.user_id || null;
        await logAction(actorId, "CREATE", "USER", userId);

        res.json({
            message: "User created",
            user_id: userId,
            roles_assigned: roleList
        });
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Get all users (sanitized)
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await query(`
            SELECT user_id, username, email, is_active, created_at
            FROM users
        `);

        res.json(users);
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Get a single user (sanitized)
 */
exports.getUser = async (req, res) => {
    try {
        const rows = await query(
            `SELECT user_id, username, email, is_active, created_at
             FROM users
             WHERE user_id = ?`,
            [req.params.id]
        );

        res.json(rows[0] || null);
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Update user (username/email)
 * Password updates handled separately
 */
exports.updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        await run(
            `UPDATE users
             SET username = ?, email = ?
             WHERE user_id = ?`,
            [username, email, req.params.id]
        );

        const actorId = req.user?.user_id || null;
        await logAction(actorId, "UPDATE", "USER", req.params.id);

        res.json({ message: "User updated" });
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Update password
 */
exports.updatePassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: "password required" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await run(
            `UPDATE users
             SET password_hash = ?
             WHERE user_id = ?`,
            [hashed, req.params.id]
        );

        const actorId = req.user?.user_id || null;
        await logAction(actorId, "UPDATE_PASSWORD", "USER", req.params.id);

        res.json({ message: "Password updated" });
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Soft delete (deactivate user)
 */
exports.deleteUser = async (req, res) => {
    try {
        await run(
            `UPDATE users
             SET is_active = 0
             WHERE user_id = ?`,
            [req.params.id]
        );

        const actorId = req.user?.user_id || null;
        await logAction(actorId, "DEACTIVATE", "USER", req.params.id);

        res.json({ message: "User deactivated" });
    } catch (err) {
        handleError(res, err);
    }
};


exports.test = (req, res) => {
    res.json({ message: "users controller test" });
};

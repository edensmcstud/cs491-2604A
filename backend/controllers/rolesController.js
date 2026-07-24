const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Assign a role to a user
 */
exports.assignRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

        if (!user_id || !role_id) {
            return res.status(400).json({ error: "user_id and role_id required" });
        }

        // Validate user exists
        const userExists = await query(
            `SELECT user_id FROM users WHERE user_id = ?`,
            [user_id]
        );

        if (userExists.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate role exists
        const roleExists = await query(
            `SELECT role_id FROM roles WHERE role_id = ?`,
            [role_id]
        );

        if (roleExists.length === 0) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Prevent duplicate role assignment
        const existing = await query(
            `SELECT 1 FROM user_roles WHERE user_id = ? AND role_id = ?`,
            [user_id, role_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "Role already assigned to user" });
        }

        // Assign role
        await run(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [user_id, role_id]
        );

        // Audit log (correct property)
        await logAction(req.user.user_id, "ASSIGN_ROLE", "USER", user_id);

        res.json({ message: "Role assigned" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get all roles
 */
exports.getRoles = async (req, res) => {
    try {
        const roles = await query(`SELECT * FROM roles ORDER BY role_id ASC`);
        res.json(roles);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "roles controller test" });
};

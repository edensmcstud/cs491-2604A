const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.assignRole = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

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
            `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
            [user_id, role_id]
        );

        // Audit log (correct property)
        await logAction(req.user.id, "ASSIGN_ROLE", "USER", user_id);

        res.json({ message: "Role assigned" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await query("SELECT * FROM roles");
        res.json(roles);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "roles controller test" });
};

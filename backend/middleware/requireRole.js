// backend/middleware/requireRole.js
const { query } = require('../utils/db');

module.exports = function requireRole(roleName) {
    return async (req, res, next) => {
        try {
            const roles = await query(
                `SELECT r.role_name
                 FROM roles r
                 JOIN user_roles ur ON r.role_id = ur.role_id
                 WHERE ur.user_id = ?`,
                [req.user.user_id]
            );

            if (!roles.some(r => r.role_name === roleName)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    };
};

console.log("requirePermission LOADED");

const { query } = require("../utils/db");

module.exports = function requirePermission(module, action) {
    const mod = String(module).trim();
    const act = String(action).trim();

    return async (req, res, next) => {
        try {
            const roles = req.user.roles;

            const rows = await query(
                `SELECT 1
                 FROM role_permissions rp
                 JOIN permissions p ON rp.permission_id = p.permission_id
                 JOIN roles r ON rp.role_id = r.role_id
                 WHERE r.role_name IN (${roles.map(() => "?").join(",")})
                   AND p.module = ?
                   AND p.action = ?
                 LIMIT 1`,
                [...roles, mod, act]
            );

            if (rows.length === 0) {
                return res.status(403).json({ error: "Forbidden: insufficient permission" });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

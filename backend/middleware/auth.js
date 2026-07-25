const jwt = require("jsonwebtoken");
const { query } = require("../utils/db");

module.exports = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Load user from DB
        const users = await query(
            `SELECT user_id, username, is_active
             FROM users
             WHERE user_id = ?`,
            [payload.user_id]
        );

        if (users.length === 0 || users[0].is_active !== 1) {
            return res.status(401).json({ error: "User inactive or not found" });
        }

        // Load roles from DB
        const roles = await query(
            `SELECT r.role_name
             FROM user_roles ur
             JOIN roles r ON ur.role_id = r.role_id
             WHERE ur.user_id = ?`,
            [payload.user_id]
        );

        req.user = {
            user_id: users[0].user_id,
            username: users[0].username,
            roles: roles.map(r => r.role_name)
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

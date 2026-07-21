const { query } = require("../utils/db");

module.exports = async function auth(req, res, next) {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "Missing session token" });
        }

        // Strip Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        // Look up session + user + role
        const rows = await query(
            `SELECT 
                sessions.user_id,
                sessions.expires_at,
                users.username,
                roles.name AS role
             FROM sessions
             JOIN users ON users.id = sessions.user_id
             LEFT JOIN user_roles ON user_roles.user_id = users.id
             LEFT JOIN roles ON roles.id = user_roles.role_id
             WHERE sessions.token = ?`,
            [token]
        );

        const session = rows[0];

        if (!session) {
            return res.status(401).json({ error: "Invalid session token" });
        }

        // Check expiry
        if (Date.now() > session.expires_at) {
            return res.status(401).json({ error: "Session expired" });
        }

        // Attach user info
        req.user = {
            id: session.user_id,
            username: session.username,
            role: session.role
        };

        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

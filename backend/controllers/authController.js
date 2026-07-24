const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { logAction } = require("../utils/audit");

/**
 * Login
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const valid = await user.verifyPassword(password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Load roles
        const roles = await Users.getRoles(user.user_id);

        // Load permissions for these roles
        const permRows = await Users.getPermissionsForRoles(roles);

        // Build permission matrix
        const modules = {};
        for (const p of permRows) {
            if (!modules[p.module]) modules[p.module] = {};
            modules[p.module][p.action] = true;
        }

        // Build JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                roles,
                modules
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Audit log
        await logAction(user.user_id, "LOGIN", "AUTH", null);

        return res.json({
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                roles,
                modules
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
    try {
        const actorId = req.user?.user_id || null;
        await logAction(actorId, "LOGOUT", "AUTH", null);

        res.json({ message: "Logged out" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

/**
 * Test endpoint
 */
exports.test = (req, res) => {
    res.json({ message: "auth controller test" });
};

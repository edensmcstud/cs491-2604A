const crypto = require("crypto");
const { run } = require("../utils/db");
const { getUserByUsername, validatePassword } = require("../models/users");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Fetch user
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // 2. Validate password
        const isValid = await validatePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // 3. Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

        // 4. Store session using your DB wrapper
        await run(
            `INSERT INTO sessions (user_id, token, expires_at)
             VALUES (?, ?, ?)`,
            [user.id, token, expiresAt]
        );

        // 5. Return token + user info
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.logout = async (req, res) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(400).json({ error: "Missing session token" });
        }

        // Strip Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        const result = await run(
            `DELETE FROM sessions WHERE token = ?`,
            [token]
        );

        if (result.changes === 0) {
            return res.status(400).json({ error: "Invalid session token" });
        }

        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.test = (req, res) => {
    res.json({ message: "auth controller test" });
};

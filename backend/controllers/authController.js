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
 * Register
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Basic validation
        if (!email || !password || !confirmPassword || !username) {
            return res.status(400).json({
                errorCode: "MISSING_FIELDS",
                message: "Username, email, password, and confirmPassword are required."
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                errorCode: "INVALID_EMAIL",
                message: "Email format is invalid."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                errorCode: "PASSWORD_MISMATCH",
                message: "Passwords do not match."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                errorCode: "WEAK_PASSWORD",
                message: "Password must be at least 8 characters long."
            });
        }

        // Check if user exists
        const existing = await Users.findByEmail(email);
        if (existing) {
            return res.status(409).json({
                errorCode: "EMAIL_EXISTS",
                message: "An account with this email already exists."
            });
        }

        // Create user
        const newUser = await Users.create(username, email, password);

        // Assign default role: Customer
        const customerRoleId = await Users.getRoleId("Customer");
        await Users.assignRole(newUser.user_id, customerRoleId);

        return res.status(201).json({
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.created_at
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            errorCode: "SERVER_ERROR",
            message: "An unexpected error occurred."
        });
    }
};

/**
 * Test endpoint
 */
exports.test = (req, res) => {
    res.json({ message: "auth controller test" });
};

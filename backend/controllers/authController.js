const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { logAction } = require("../utils/audit");
const bcrypt = require("bcrypt");
const { query, run } = require("../utils/db");

/**
 * Login
 */

/**
 * Public customer registration
 */
exports.register = async (req, res) => {
    let transactionStarted = false;

    try {
        const {
            username,
            password,
            email,
            first_name,
            last_name,
            phone,
            address
        } = req.body;

        // Validate required fields
        if (
            !username?.trim() ||
            !password ||
            !email?.trim() ||
            !first_name?.trim() ||
            !last_name?.trim()
        ) {
            return res.status(400).json({
                error: "Username, password, email, first name, and last name are required"
            });
        }

        // Check for an existing username or email
        const existingUsers = await query(
            `SELECT user_id, username, email
             FROM users
             WHERE username = ? OR email = ?`,
            [username.trim(), email.trim()]
        );

        if (existingUsers.length > 0) {
            const usernameTaken = existingUsers.some(
                user => user.username === username.trim()
            );

            if (usernameTaken) {
                return res.status(409).json({
                    error: "Username is already in use"
                });
            }

            return res.status(409).json({
                error: "Email is already in use"
            });
        }

        // Find the Customer role without hard-coding its numeric ID
        const roleRows = await query(
            `SELECT role_id
             FROM roles
             WHERE role_name = ?`,
            ["Customer"]
        );

        if (roleRows.length === 0) {
            return res.status(500).json({
                error: "Customer role is not configured"
            });
        }

        const customerRoleId = roleRows[0].role_id;
        const passwordHash = await bcrypt.hash(password, 10);

        await run("BEGIN TRANSACTION");
        transactionStarted = true;

        // Create login account
        const userResult = await run(
            `INSERT INTO users
             (username, password_hash, email, is_active)
             VALUES (?, ?, ?, 1)`,
            [username.trim(), passwordHash, email.trim()]
        );

        const userId = userResult.lastID;

        // Assign only the Customer role
        await run(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [userId, customerRoleId]
        );

        // Create the linked customer profile
        const customerResult = await run(
            `INSERT INTO customers
             (user_id, first_name, last_name, phone, address)
             VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                first_name.trim(),
                last_name.trim(),
                phone?.trim() || null,
                address?.trim() || null
            ]
        );

        await logAction(userId, "REGISTER", "AUTH", userId);

        await run("COMMIT");
        transactionStarted = false;

        return res.status(201).json({
            message: "Customer account created",
            user_id: userId,
            customer_id: customerResult.lastID
        });
    } catch (err) {
        if (transactionStarted) {
            try {
                await run("ROLLBACK");
            } catch (rollbackError) {
                console.error("Registration rollback failed:", rollbackError);
            }
        }

        console.error("Registration error:", err);

        if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(409).json({
                error: "An account with that username or email already exists"
            });
        }

        return res.status(500).json({
            error: "Unable to create customer account"
        });
    }
};

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

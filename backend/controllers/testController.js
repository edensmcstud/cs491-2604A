const { query, run } = require("../utils/db");
const bcrypt = require("bcrypt");
const handleError = require("../middleware/errorHandler");

/**
 * Check if DB has any users
 */
exports.dbState = async (req, res) => {
    try {
        const rows = await query("SELECT COUNT(*) AS count FROM users");
        res.json({ empty: rows[0].count === 0 });
    } catch (err) {
        res.status(500).json({ error: "db-state failed", details: err.message });
    }
};


/**
 * Seed test data
 * Creates:
 * - roles
 * - users
 * - user_roles
 * - customers
 */
exports.seed = async (req, res) => {
    try {
        // Step 1: Insert roles
        await run(`
            INSERT INTO roles (role_name) VALUES
            ('admin_test'),
            ('employee_test'),
            ('auditor_test'),
            ('customer_test')
        `);

        // Step 2: Insert users (hashed passwords)
        const hashed = await bcrypt.hash("password", 10);

        await run(`
            INSERT INTO users (username, password_hash, email, is_active)
            VALUES
            ('admin_test', ?, 'admin_test@example.com', 1),
            ('employee_test', ?, 'employee_test@example.com', 1),
            ('auditor_test', ?, 'auditor_test@example.com', 1),
            ('customer_test', ?, 'customer_test@example.com', 1)
        `, [hashed, hashed, hashed, hashed]);

        // Step 3: Assign roles to matching users
        const users = await query(`SELECT user_id, username FROM users WHERE username LIKE '%_test'`);
        const roles = await query(`SELECT role_id, role_name FROM roles WHERE role_name LIKE '%_test'`);

        for (const user of users) {
            const role = roles.find(r => r.role_name.startsWith(user.username.split("_")[0]));
            if (role) {
                await run(
                    `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
                    [user.user_id, role.role_id]
                );
            }
        }

        // Step 4: Create customer profile for customer_test
        const customerUser = users.find(u => u.username === "customer_test");
        if (customerUser) {
            await run(
                `INSERT INTO customers (user_id, first_name, last_name, phone, address)
                 VALUES (?, 'Customer', 'Test', '555-0000', 'Test Lane')`,
                [customerUser.user_id]
            );
        }

        res.json({ message: "seed complete" });
    } catch (err) {
        res.status(500).json({ error: "seed failed", details: err.message });
    }
};


/**
 * Cleanup test data
 */
exports.cleanup = async (req, res) => {
    try {
        // Remove user_roles
        await run(`
            DELETE FROM user_roles
            WHERE user_id IN (SELECT user_id FROM users WHERE username LIKE '%_test')
        `);

        // Remove customers linked to test users
        await run(`
            DELETE FROM customers
            WHERE user_id IN (SELECT user_id FROM users WHERE username LIKE '%_test')
        `);

        // Remove users
        await run(`DELETE FROM users WHERE username LIKE '%_test'`);

        // Remove roles
        await run(`DELETE FROM roles WHERE role_name LIKE '%_test'`);

        res.json({ message: "cleanup complete" });
    } catch (err) {
        res.status(500).json({ error: "cleanup failed", details: err.message });
    }
};


/**
 * Ping endpoint
 */
exports.ping = (req, res) => {
    res.json({ message: "test API alive" });
};

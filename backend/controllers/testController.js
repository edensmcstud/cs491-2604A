const db = require("../database/connection");

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}


exports.dbState = async (req, res) => {
    try {
        const rows = await query("SELECT COUNT(*) AS count FROM users");
        res.json({ empty: rows[0].count === 0 });
    } catch (err) {
        res.status(500).json({ error: "db-state failed", details: err.message });
    }
};

exports.seed = async (req, res) => {
    try {
        await run(`
            INSERT INTO roles (role_name) VALUES
            ('admin_test'),
            ('employee_test'),
            ('auditor_test'),
            ('customer_test')
        `);

        await run(`
            INSERT INTO users (username, password_hash, email, is_active)
            VALUES
            ('admin_test', 'password', 'admin_test@example.com', 1),
            ('employee_test', 'password', 'employee_test@example.com', 1),
            ('auditor_test', 'password', 'auditor_test@example.com', 1),
            ('customer_test', 'password', 'customer_test@example.com', 1)
        `);

        await run(`
            INSERT INTO user_roles (user_id, role_id)
            SELECT u.user_id, r.role_id
            FROM users u, roles r
            WHERE u.username LIKE '%_test'
            AND r.role_name LIKE '%_test'
        `);

        await run(`
            INSERT INTO customers (name, email, phone, address)
            VALUES ('Customer Test', 'customer_test@example.com', '555-0000', 'Test Lane')
        `);

        res.json({ message: "seed complete" });
    } catch (err) {
        res.status(500).json({ error: "seed failed", details: err.message });
    }
};

exports.cleanup = async (req, res) => {
    try {
        await run(`
            DELETE FROM user_roles
            WHERE user_id IN (SELECT user_id FROM users WHERE username LIKE '%_test')
        `);

        await run(`DELETE FROM users WHERE username LIKE '%_test'`);
        await run(`DELETE FROM roles WHERE role_name LIKE '%_test'`);
        await run(`DELETE FROM customers WHERE email LIKE '%_test@example.com'`);

        res.json({ message: "cleanup complete" });
    } catch (err) {
        res.status(500).json({ error: "cleanup failed", details: err.message });
    }
};

exports.ping = (req, res) => {
    res.json({ message: "test API alive" });
};

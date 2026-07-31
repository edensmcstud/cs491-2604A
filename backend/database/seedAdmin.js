const bcrypt = require("bcrypt");
const { query, run } = require("../utils/db");

(async () => {
    try {
        console.log("Checking for existing admin...");

        const existing = await query(
            `SELECT user_id FROM users
             JOIN user_roles USING (user_id)
             JOIN roles USING (role_id)
             WHERE role_name = 'Admin'
             LIMIT 1`
        );

        if (existing.length > 0) {
            console.log("Admin already exists. No action taken.");
            process.exit(0);
        }

        console.log("No admin found — creating initial admin user...");

        const username = "admin";
        const email = "admin@example.com";
        const password = "admin"; // You can change this manually later

        const hash = await bcrypt.hash(password, 10);

        await run(
            `INSERT INTO users (username, password_hash, email, is_active, created_at)
             VALUES (?, ?, ?, 1, datetime('now'))`,
            [username, hash, email]
        );

        const row = await query(
            `SELECT user_id FROM users WHERE username = ?`,
            [username]
        );

        const userId = row[0].user_id;

        await run(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (
                ?,
                (SELECT role_id FROM roles WHERE role_name = 'Admin')
             )`,
            [userId]
        );

        console.log("Initial admin created successfully:", {
            user_id: userId,
            username,
            email
        });

        process.exit(0);

    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
})();

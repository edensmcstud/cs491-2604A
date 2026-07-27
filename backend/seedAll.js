const bcrypt = require("bcrypt");
const { query, run } = require("./utils/db");

(async () => {
    try {
        console.log("=== Seeding Roles ===");

        const roles = ["Admin", "Employee", "Customer"];
        for (const role of roles) {
            await run(
                `INSERT OR IGNORE INTO roles (role_name)
                 VALUES (?)`,
                [role]
            );
        }

        console.log("Roles seeded:", roles);

        // =====================================================
        // PERMISSIONS — FINAL RBAC MODEL
        // =====================================================
        const permissions = [
            // INVENTORY
            { module: "inventory", action: "read" },
            { module: "inventory", action: "initialize" },
            { module: "inventory", action: "adjust" },
            { module: "inventory", action: "update" },

            // SALES
            { module: "sales", action: "read" },
            { module: "sales", action: "create" },

            // CUSTOMER ORDERS
            { module: "customer_orders", action: "read" },
            { module: "customer_orders", action: "create" },

            // SUPPLIER ORDERS
            { module: "supplier_orders", action: "read" },
            { module: "supplier_orders", action: "create" },
            { module: "supplier_orders", action: "receive" },

            // AUDIT LOGS
            { module: "audit_logs", action: "read" },

            // SYSTEM MANAGEMENT
            { module: "roles", action: "read" },
            { module: "permissions", action: "read" },
            { module: "users", action: "read" }
        ];

        console.log("=== Seeding Permissions ===");

        for (const perm of permissions) {
            await run(
                `INSERT OR IGNORE INTO permissions (module, action)
                 VALUES (?, ?)`,
                [perm.module, perm.action]
            );
        }

        console.log("Permissions seeded:", permissions.length);

        // =====================================================
        // ROLE → PERMISSION ASSIGNMENTS
        // =====================================================

        console.log("=== Assigning Permissions to Roles ===");

        async function assign(roleName, module, action) {
            await run(
                `INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
                 VALUES (
                    (SELECT role_id FROM roles WHERE role_name=?),
                    (SELECT permission_id FROM permissions WHERE module=? AND action=?)
                 )`,
                [roleName, module, action]
            );
        }

        // ADMIN: full access
        for (const perm of permissions) {
            await assign("Admin", perm.module, perm.action);
        }

        // EMPLOYEE: operational access
        const employeePerms = [
            ["books", "read"],
            ["books", "create"],
            ["books", "update"],

            ["inventory", "read"],
            ["inventory", "adjust"],

            ["sales", "read"],
            ["sales", "create"],

            ["customer_orders", "read"],
            ["customer_orders", "create"],

            ["supplier_orders", "read"],
            ["supplier_orders", "create"]
        ];

        for (const [module, action] of employeePerms) {
            await assign("Employee", module, action);
        }

        // CUSTOMER: minimal access
        const customerPerms = [
            ["books", "read"],
            ["customer_orders", "create"]
        ];

        for (const [module, action] of customerPerms) {
            await assign("Customer", module, action);
        }

        console.log("Role → Permission assignments complete.");

        // =====================================================
        // USER SEEDING
        // =====================================================

        console.log("=== Seeding Users ===");

        async function seedUser(username, email, password, roleName) {
            const hash = await bcrypt.hash(password, 10);

            const existing = await query(
                `SELECT * FROM users
                 WHERE username=? OR email=?
                 LIMIT 1`,
                [username, email]
            );

            let userId;

            if (existing.length > 0) {
                const user = existing[0];
                userId = user.user_id;

                await run(
                    `UPDATE users
                     SET username=?,
                         password_hash=?,
                         email=?,
                         is_active=1
                     WHERE user_id=?`,
                    [username, hash, email, userId]
                );

                console.log(`Updated existing ${roleName} user:`, user);
            } else {
                await run(
                    `INSERT INTO users (username, password_hash, email, is_active, created_at)
                     VALUES (?, ?, ?, 1, datetime('now'))`,
                    [username, hash, email]
                );

                const row = await query(
                    `SELECT user_id FROM users WHERE username=?`,
                    [username]
                );

                userId = row[0].user_id;

                console.log(`Created new ${roleName} user with ID ${userId}`);
            }

            await run(
                `INSERT OR IGNORE INTO user_roles (user_id, role_id)
                 VALUES (
                    ?,
                    (SELECT role_id FROM roles WHERE role_name=?)
                 )`,
                [userId, roleName]
            );

            return { username, email, password, role: roleName };
        }

        const admin = await seedUser("admin", "admin@example.com", "admin", "Admin");
        const employee = await seedUser("employee", "employee@example.com", "employee", "Employee");
        const customer = await seedUser("customer", "customer@example.com", "customer", "Customer");

        console.log("\n=== Seed Complete ===");
        console.log("Admin:", admin);
        console.log("Employee:", employee);
        console.log("Customer:", customer);

        process.exit(0);

    } catch (err) {
        console.error("Error seeding RBAC:", err);
        process.exit(1);
    }
})();

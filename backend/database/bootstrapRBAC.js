const bcrypt = require("bcrypt");
const { query, run } = require("../utils/db");

module.exports = async function bootstrapRBAC() {
    console.log("=== Initializing Unified RBAC (Corrected) ===");

    // =====================================================
    // ROLES
    // =====================================================
    const roles = ["Admin", "Employee", "Customer"];

    for (const role of roles) {
        await run(
            `INSERT OR IGNORE INTO roles (role_name)
             VALUES (?)`,
            [role]
        );
    }

    console.log("Roles ensured:", roles);

    // =====================================================
    // PERMISSIONS (FULL SYSTEM)
    // =====================================================
    const permissions = [
        // BOOKS
        { module: "books", action: "read" },
        { module: "books", action: "create" },
        { module: "books", action: "update" },
        { module: "books", action: "delete" },

        // INVENTORY
        { module: "inventory", action: "read" },
        { module: "inventory", action: "initialize" },
        { module: "inventory", action: "adjust" },
        { module: "inventory", action: "update" },

        // SALES
        { module: "sales", action: "read" },
        { module: "sales", action: "create" },

        // CUSTOMER ORDERS (Unified)
        { module: "customer_orders", action: "read" },
        { module: "customer_orders", action: "create" },
        { module: "customer_orders", action: "fulfill" },   // NEW

        // SUPPLIER ORDERS
        { module: "supplier_orders", action: "read" },
        { module: "supplier_orders", action: "create" },
        { module: "supplier_orders", action: "receive" },

        // CART
        { module: "cart", action: "use" },

        // AUDIT LOGS
        { module: "audit_logs", action: "read" },

        // SYSTEM MANAGEMENT
        { module: "roles", action: "read" },
        { module: "permissions", action: "read" },
        { module: "users", action: "read" }
    ];

    for (const perm of permissions) {
        await run(
            `INSERT OR IGNORE INTO permissions (module, action)
             VALUES (?, ?)`,
            [perm.module, perm.action]
        );
    }

    console.log("Permissions ensured:", permissions.length);

    // =====================================================
    // ROLE → PERMISSION ASSIGNMENT
    // =====================================================

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
        ["inventory", "update"],

        ["sales", "read"],
        ["sales", "create"],

        ["customer_orders", "read"],
        ["customer_orders", "fulfill"],   // NEW

        ["supplier_orders", "read"],
        ["supplier_orders", "create"]
    ];

    for (const [module, action] of employeePerms) {
        await assign("Employee", module, action);
    }

    // CUSTOMER: minimal access
    const customerPerms = [
        ["books", "read"],
        ["cart", "use"]
        // Removed customer_orders entirely
    ];

    for (const [module, action] of customerPerms) {
        await assign("Customer", module, action);
    }

    console.log("Role → Permission assignments complete.");

    // =====================================================
    // USER SEEDING
    // =====================================================

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
            userId = existing[0].user_id;

            await run(
                `UPDATE users
                 SET username=?, password_hash=?, email=?, is_active=1
                 WHERE user_id=?`,
                [username, hash, email, userId]
            );
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
        }

        await run(
            `INSERT OR IGNORE INTO user_roles (user_id, role_id)
             VALUES (
                ?,
                (SELECT role_id FROM roles WHERE role_name=?)
             )`,
            [userId, roleName]
        );

        return { username, email, role: roleName };
    }

    const admin = await seedUser("admin", "admin@example.com", "admin", "Admin");
    const employee = await seedUser("employee", "employee@example.com", "employee", "Employee");
    const customer = await seedUser("customer", "customer@example.com", "customer", "Customer");

    console.log("Users seeded:", { admin, employee, customer });

    console.log("=== Unified RBAC Initialization Complete ===");
};

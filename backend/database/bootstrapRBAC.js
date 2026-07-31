module.exports = async function bootstrapRBAC(db) {
    console.log("Initializing RBAC...");

    // Insert roles
    const roles = ["Admin", "Employee", "Customer"];
    for (const role of roles) {
        await run(
            `INSERT OR IGNORE INTO roles (role_name) VALUES (?)`,
            [role]
        );
    }

    // Insert permissions
    const permissions = [
        { module: "books", action: "read" },
        { module: "books", action: "create" },
        { module: "books", action: "update" },
        { module: "books", action: "delete" },
        // ... (all your permissions)
    ];

    for (const perm of permissions) {
        await run(
            `INSERT OR IGNORE INTO permissions (module, action)
             VALUES (?, ?)`,
            [perm.module, perm.action]
        );
    }

    // Assign permissions to roles
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

    // Admin gets everything
    for (const perm of permissions) {
        await assign("Admin", perm.module, perm.action);
    }

    // Employee gets operational subset
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
        ["customer_orders", "create"],
        ["supplier_orders", "read"],
        ["supplier_orders", "create"]
    ];

    for (const [module, action] of employeePerms) {
        await assign("Employee", module, action);
    }

    // Customer gets minimal access
    const customerPerms = [
        ["books", "read"],
        ["customer_orders", "create"]
    ];

    for (const [module, action] of customerPerms) {
        await assign("Customer", module, action);
    }

    console.log("RBAC initialization complete.");
};

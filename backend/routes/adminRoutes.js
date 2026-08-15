console.log("adminRoutes.js LOADED");

const express = require("express");
const router = express.Router();

const Users = require("../models/users");
const { query, run } = require("../utils/db");

const authenticate = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

/**
 * ============================
 * USERS
 * ============================
 */

/**
 * GET /admin/users
 * List all users
 */
router.get(
    "/users",
    authenticate,
    requirePermission("users", "read"),
    async (req, res) => {
        try {
            const users = await Users.getAllUsers();
            res.json(users);
        } catch (err) {
            console.error("GET /admin/users error:", err);
            res.status(500).json({ error: "Failed to load users" });
        }
    }
);

/**
 * DELETE /admin/users/:id
 */
router.delete(
    "/users/:id",
    authenticate,
    requirePermission("users", "read"),
    async (req, res) => {
        try {
            const user_id = Number(req.params.id);

            // Prevent deleting yourself
            if (req.user.user_id === user_id) {
                return res.status(400).json({ error: "You cannot delete your own account." });
            }

            // Prevent deleting the last admin
            const targetRoles = await Users.getRoles(user_id);
            const isTargetAdmin = targetRoles.includes("Admin");

            if (isTargetAdmin) {
                const adminCountRows = await query(
                    `SELECT COUNT(*) AS count
                     FROM user_roles ur
                     JOIN roles r ON ur.role_id = r.role_id
                     WHERE r.role_name = 'Admin'`
                );

                const adminCount = adminCountRows[0].count;

                if (adminCount <= 1) {
                    return res.status(400).json({ error: "Cannot delete the last admin." });
                }
            }

            await Users.deleteUser(user_id);

            res.json({ message: "User deleted" });
        } catch (err) {
            console.error("DELETE /admin/users/:id error:", err);
            res.status(500).json({ error: "Failed to delete user" });
        }
    }
);

/**
 * PUT /admin/users/:id/role
 */
router.put(
    "/users/:id/role",
    authenticate,
    requirePermission("users", "read"),
    async (req, res) => {
        try {
            const user_id = req.params.id;
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({ error: "Role is required" });
            }

            await Users.setUserRole(user_id, role);

            res.json({ message: `Role updated to ${role}` });
        } catch (err) {
            console.error("PUT /admin/users/:id/role error:", err);
            res.status(500).json({ error: "Failed to update role" });
        }
    }
);

/**
 * POST /admin/users
 */
router.post(
    "/users",
    authenticate,
    requirePermission("users", "read"),
    async (req, res) => {
        try {
            const { username, email, password, role } = req.body;

            if (!username || !email || !password || !role) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const newUser = await Users.create(username, email, password);
            await Users.setUserRole(newUser.user_id, role);

            res.status(201).json({
                message: "User created",
                user: newUser
            });

        } catch (err) {
            console.error("POST /admin/users error:", err);
            res.status(500).json({ error: "Failed to create user" });
        }
    }
);

/**
 * PUT /admin/users/:id/password
 * Reset a user's password
 */
router.put(
    "/users/:id/password",
    authenticate,
    requirePermission("users", "read"),
    async (req, res) => {
        try {
            const user_id = req.params.id;
            const { newPassword } = req.body;

            if (!newPassword) {
                return res.status(400).json({ error: "New password is required" });
            }

            const password_hash = await require("bcrypt").hash(newPassword, 10);

            await run(
                `UPDATE users
                 SET password_hash = ?
                 WHERE user_id = ?`,
                [password_hash, user_id]
            );

            res.json({ message: "Password updated" });
        } catch (err) {
            console.error("PUT /admin/users/:id/password error:", err);
            res.status(500).json({ error: "Failed to update password" });
        }
    }
);

/**
 * ============================
 * ROLES
 * ============================
 */

router.get(
    "/roles",
    authenticate,
    requirePermission("roles", "read"),
    async (req, res) => {
        try {
            const roles = await query(
                `SELECT role_id, role_name
                 FROM roles
                 ORDER BY role_name ASC`
            );

            for (const role of roles) {
                const perms = await query(
                    `SELECT p.module, p.action
                     FROM permissions p
                     JOIN role_permissions rp ON rp.permission_id = p.permission_id
                     WHERE rp.role_id = ?`,
                    [role.role_id]
                );

                role.permissions = perms;
            }

            res.json(roles);
        } catch (err) {
            console.error("GET /admin/roles error:", err);
            res.status(500).json({ error: "Failed to load roles" });
        }
    }
);

/**
 * ============================
 * PERMISSIONS
 * ============================
 */

router.get(
    "/permissions",
    authenticate,
    requirePermission("permissions", "read"),
    async (req, res) => {
        try {
            const roles = await query(
                `SELECT role_id, role_name
                 FROM roles
                 ORDER BY role_name ASC`
            );

            const result = [];

            for (const role of roles) {
                const perms = await query(
                    `SELECT p.module, p.action
                     FROM permissions p
                     JOIN role_permissions rp ON rp.permission_id = p.permission_id
                     WHERE rp.role_id = ?`,
                    [role.role_id]
                );

                result.push({
                    role_name: role.role_name,
                    permissions: perms
                });
            }

            res.json(result);
        } catch (err) {
            console.error("GET /admin/permissions error:", err);
            res.status(500).json({ error: "Failed to load permissions" });
        }
    }
);

/**
 * ============================
 * AUDIT LOG
 * ============================
 */

router.get(
    "/audit-log",
    authenticate,
    requirePermission("audit_logs", "read"),
    async (req, res) => {
        try {
            const rows = await query(
                `SELECT a.audit_id,
                        a.user_id,
                        u.username,
                        a.action_type,
                        a.entity_type,
                        a.entity_id,
                        a.created_at
                 FROM audit_logs a
                 LEFT JOIN users u ON u.user_id = a.user_id
                 ORDER BY a.created_at DESC
                 LIMIT 500`
            );

            res.json(rows);
        } catch (err) {
            console.error("GET /admin/audit-log error:", err);
            res.status(500).json({ error: "Failed to load audit log" });
        }
    }
);

router.get("/ping", (req, res) => {
    res.json({ message: "admin routes working" });
});

module.exports = router;

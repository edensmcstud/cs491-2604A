const { query, run } = require("../utils/db");
const bcrypt = require("bcrypt");

class Users {
    constructor(row) {
        this.user_id = row.user_id;
        this.username = row.username;
        this.password_hash = row.password_hash;
        this.email = row.email;
        this.is_active = row.is_active;
        this.created_at = row.created_at;
    }

    /**
     * Find user by username
     */
    static async findByUsername(username) {
        const rows = await query(
            `SELECT *
             FROM users
             WHERE username = ?
             LIMIT 1`,
            [username]
        );

        if (rows.length === 0) return null;
        return new Users(rows[0]);
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const rows = await query(
            `SELECT *
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [email]
        );

        if (rows.length === 0) return null;
        return new Users(rows[0]);
    }

    /**
     * Create a new user
     */
    static async create(username, email, password) {
        const password_hash = await bcrypt.hash(password, 10);

        const result = await run(
            `INSERT INTO users (username, email, password_hash, is_active, created_at)
             VALUES (?, ?, ?, 1, datetime('now'))`,
            [username, email, password_hash]
        );

        return {
            user_id: result.lastID,
            username,
            email,
            created_at: new Date().toISOString()
        };
    }

    /**
     * Assign a role to a user
     */
    static async assignRole(user_id, role_id) {
        await run(
            `INSERT INTO user_roles (user_id, role_id)
             VALUES (?, ?)`,
            [user_id, role_id]
        );
    }

    /**
     * Remove ALL roles from a user (single-role model)
     */
    static async removeRoles(user_id) {
        await run(
            `DELETE FROM user_roles
             WHERE user_id = ?`,
            [user_id]
        );
    }

    /**
     * Set a user's role (single-role model)
     * Removes old role → assigns new role
     */
    static async setUserRole(user_id, roleName) {
        const role_id = await Users.getRoleId(roleName);
        if (!role_id) throw new Error(`Role not found: ${roleName}`);

        await Users.removeRoles(user_id);
        await Users.assignRole(user_id, role_id);
    }

    /**
     * Delete a user (and their roles)
     */
    static async deleteUser(user_id) {
        await run(`DELETE FROM user_roles WHERE user_id = ?`, [user_id]);
        await run(`DELETE FROM users WHERE user_id = ?`, [user_id]);
    }

    /**
     * Lookup role_id by role_name
     */
    static async getRoleId(roleName) {
        const rows = await query(
            `SELECT role_id
             FROM roles
             WHERE role_name = ?
             LIMIT 1`,
            [roleName]
        );

        return rows.length ? rows[0].role_id : null;
    }

    /**
     * Get role names for a user
     */
    static async getRoles(user_id) {
        const rows = await query(
            `SELECT r.role_name
             FROM roles r
             JOIN user_roles ur ON ur.role_id = r.role_id
             WHERE ur.user_id = ?`,
            [user_id]
        );

        return rows.map(r => r.role_name);
    }

    /**
     * Get ALL users (for admin panel)
     */
    static async getAllUsers() {
        const rows = await query(
            `SELECT user_id, username, email, is_active, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        // Attach roles to each user
        for (const row of rows) {
            const roles = await Users.getRoles(row.user_id);
            row.roles = roles;
        }

        return rows;
    }

    /**
     * Verify password
     */
    async verifyPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }

    /**
     * Get permissions for a list of role names
     */
    static async getPermissionsForRoles(roleNames) {
        if (!roleNames || roleNames.length === 0) return [];

        const placeholders = roleNames.map(() => "?").join(",");
        const roleRows = await query(
            `SELECT role_id
             FROM roles
             WHERE role_name IN (${placeholders})`,
            roleNames
        );

        if (roleRows.length === 0) return [];

        const roleIds = roleRows.map(r => r.role_id);

        const permPlaceholders = roleIds.map(() => "?").join(",");
        const permRows = await query(
            `SELECT p.module, p.action
             FROM permissions p
             JOIN role_permissions rp ON rp.permission_id = p.permission_id
             WHERE rp.role_id IN (${permPlaceholders})`,
            roleIds
        );

        return permRows;
    }
}

module.exports = Users;

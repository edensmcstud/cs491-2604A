const { query } = require("../utils/db");
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

        // Convert role names → role_ids
        const placeholders = roleNames.map(() => "?").join(",");
        const roleRows = await query(
            `SELECT role_id
             FROM roles
             WHERE role_name IN (${placeholders})`,
            roleNames
        );

        if (roleRows.length === 0) return [];

        const roleIds = roleRows.map(r => r.role_id);

        // Load permissions for those role_ids
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

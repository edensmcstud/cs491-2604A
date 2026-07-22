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

    static async findByUsername(username) {
        const rows = await query(
            "SELECT * FROM users WHERE username = ? LIMIT 1",
            [username]
        );

        if (rows.length === 0) return null;
        return new Users(rows[0]);
    }

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

    async verifyPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

module.exports = Users;

const bcrypt = require("bcrypt");
const { query } = require("../utils/db");

// Fetch a user by username, including role
async function getUserByUsername(username) {
    const rows = await query(
        `SELECT 
            users.id,
            users.username,
            users.password_hash,
            roles.name AS role
         FROM users
         LEFT JOIN user_roles ON user_roles.user_id = users.id
         LEFT JOIN roles ON roles.id = user_roles.role_id
         WHERE users.username = ?`,
        [username]
    );

    return rows[0] || null;
}

// Validate password during login
async function validatePassword(password, storedHash) {
    return bcrypt.compare(password, storedHash);
}

module.exports = {
    getUserByUsername,
    validatePassword
};

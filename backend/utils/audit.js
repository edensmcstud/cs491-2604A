// backend/utils/audit.js
const { run } = require('./db');

async function logAction(userId, actionType, entityType, entityId = null) {
    await run(
        `INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id)
         VALUES (?, ?, ?, ?)`,
        [userId, actionType, entityType, entityId]
    );
}

module.exports = { logAction };

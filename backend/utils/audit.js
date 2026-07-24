const { run } = require("./db");

async function logAction(userId, actionType, entityType, entityId = null) {
    // Normalize inputs defensively
    const uid = userId ?? null;
    const act = typeof actionType === "string" ? actionType : String(actionType);
    const ent = typeof entityType === "string" ? entityType : String(entityType);
    const eid = entityId ?? null;

    await run(
        `INSERT INTO audit_logs (user_id, action_type, entity_type, entity_id)
         VALUES (?, ?, ?, ?)`,
        [uid, act, ent, eid]
    );
}

module.exports = { logAction };

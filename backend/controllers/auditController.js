const { query } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Get all audit logs (sanitized)
 */
exports.getAuditLogs = async (req, res) => {
    try {
        // Log that the user viewed audit logs
        await logAction(req.user.user_id, "READ", "AUDIT_LOGS", null);

        const logs = await query(`
            SELECT audit_id,
                   user_id,
                   action_type,
                   entity_type,
                   entity_id,
                   created_at
            FROM audit_logs
            ORDER BY created_at DESC
        `);

        res.json(logs);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "audit controller test" });
};

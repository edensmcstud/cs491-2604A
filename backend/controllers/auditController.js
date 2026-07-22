const { query } = require("../utils/db");
const handleError = require("../middleware/errorHandler");

/**
 * Get all audit logs (sanitized)
 */
exports.getAuditLogs = async (req, res) => {
    try {
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

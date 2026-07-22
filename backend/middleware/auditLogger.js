const { logAction } = require("../utils/audit");

module.exports = async function auditLogger(req, res, next) {
    try {
        // Only log if user is authenticated
        const userId = req.user?.user_id || null;

        // Build action metadata
        const actionType = `${req.method}`;
        const entityType = "REQUEST";
        const entityId = req.originalUrl;

        // Save audit log entry
        await logAction(userId, actionType, entityType, entityId);

        next();
    } catch (err) {
        console.error("Audit logger error:", err);
        next(); // Never block the request
    }
};

const { query } = require("../utils/db");
const handleError = require("../middleware/errorHandler");

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await query("SELECT * FROM audit_logs");
        res.json(logs);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "audit controller test" });
};

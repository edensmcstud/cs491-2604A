const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Daily report placeholder
 */
exports.dailyReport = async (req, res) => {
    try {
        await logAction(req.user.user_id, "READ", "REPORT_DAILY", null);
        res.json({ message: "daily report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Weekly report placeholder
 */
exports.weeklyReport = async (req, res) => {
    try {
        await logAction(req.user.user_id, "READ", "REPORT_WEEKLY", null);
        res.json({ message: "weekly report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Monthly report placeholder
 */
exports.monthlyReport = async (req, res) => {
    try {
        await logAction(req.user.user_id, "READ", "REPORT_MONTHLY", null);
        res.json({ message: "monthly report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Test endpoint
 */
exports.test = (req, res) => {
    res.json({ message: "reports controller test" });
};

const handleError = require("../middleware/errorHandler");

/**
 * Backup placeholder
 */
exports.backup = async (req, res) => {
    try {
        res.json({ message: "Backup placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Restore placeholder
 */
exports.restore = async (req, res) => {
    try {
        res.json({ message: "Restore placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Test endpoint
 */
exports.test = (req, res) => {
    res.json({ message: "backup controller test" });
};

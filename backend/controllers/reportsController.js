const handleError = require("../middleware/errorHandler");

exports.dailyReport = async (req, res) => {
    try {
        res.json({ message: "daily report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.weeklyReport = async (req, res) => {
    try {
        res.json({ message: "weekly report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.monthlyReport = async (req, res) => {
    try {
        res.json({ message: "monthly report placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "reports controller test" });
};

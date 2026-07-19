const handleError = require("../middleware/errorHandler");

exports.backup = async (req, res) => {
    try {
        res.json({ message: "backup placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.restore = async (req, res) => {
    try {
        res.json({ message: "restore placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "backup controller test" });
};

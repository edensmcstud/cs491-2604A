const handleError = require("../middleware/errorHandler");

exports.register = async (req, res) => {
    try {
        // TODO: create customer record
        res.json({ message: "customer register placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.login = async (req, res) => {
    try {
        // TODO: validate customer login
        res.json({ message: "customer login placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "customer auth controller test" });
};

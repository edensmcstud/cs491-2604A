const { get } = require("../utils/db");
const handleError = require("../middleware/errorHandler");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // TODO: validate user credentials
        res.json({ message: "login placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.logout = async (req, res) => {
    try {
        // TODO: invalidate session/JWT
        res.json({ message: "logout placeholder" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "auth controller test" });
};

// middleware/authEmployee.js

module.exports = function authEmployee(req, res, next) {
    // TODO: Validate employee JWT/session token
    // TODO: Load employee from DB
    // TODO: Attach employee identity to req.user

    next();
};

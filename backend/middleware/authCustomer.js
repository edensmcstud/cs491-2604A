// middleware/authCustomer.js

module.exports = function authCustomer(req, res, next) {
    // TODO: Validate customer JWT/session token
    // TODO: Load customer from DB
    // TODO: Attach customer identity to req.user

    next();
};

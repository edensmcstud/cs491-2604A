// middleware/roleGuard.js

module.exports = function roleGuard(requiredRole) {
    return function (req, res, next) {
        // TODO: Ensure req.user exists (authEmployee should set this)
        // TODO: Check if req.user.role matches requiredRole

        next();
    };
};

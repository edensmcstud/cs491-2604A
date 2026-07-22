// middleware/requireRole.js

module.exports = function requireRole(...allowedRoles) {
    // Normalize all roles
    const normalized = allowedRoles.map(r =>
        r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
    );

    // Fail-fast if developer misconfigured the middleware
    if (normalized.length === 0) {
        throw new Error("requireRole() called with no roles.");
    }

    return (req, res, next) => {
        const userRoles = req.user?.roles || [];

        // Check intersection
        const hasRole = userRoles.some(r => normalized.includes(r));

        if (!hasRole) {
            return res.status(403).json({ error: "Forbidden: insufficient role" });
        }

        next();
    };
};

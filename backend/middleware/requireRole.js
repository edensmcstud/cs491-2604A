module.exports = function requireRole(...allowedRoles) {
    // Normalize all roles (Admin → Admin, admin → Admin, EMPLOYEE → Employee)
    const normalized = allowedRoles.map(r =>
        typeof r === "string"
            ? r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
            : r
    );

    if (normalized.length === 0) {
        throw new Error("requireRole() called with no roles.");
    }

    return (req, res, next) => {
        const userRoles = Array.isArray(req.user?.roles)
            ? req.user.roles.map(r =>
                r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
            )
            : [];

        const hasRole = userRoles.some(r => normalized.includes(r));

        if (!hasRole) {
            return res.status(403).json({ error: "Forbidden: insufficient role" });
        }

        next();
    };
};

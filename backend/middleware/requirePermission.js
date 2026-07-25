module.exports = function requirePermission(module, action) {
    // Normalize inputs defensively
    const mod = String(module).trim();
    const act = String(action).trim();

    return (req, res, next) => {
        const perms = req.user?.modules;

        const allowed =
            perms &&
            perms[mod] &&
            perms[mod][act] === true;

        if (!allowed) {
            return res.status(403).json({
                error: "Forbidden: insufficient permission"
            });
        }

        next();
    };
};

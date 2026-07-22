const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            user_id: payload.user_id,
            username: payload.username,
            roles: payload.roles || []
        };

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid token" });
    }
};

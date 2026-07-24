const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;

    // ============================
    // LOG RAW HEADER + TOKEN
    // ============================
    console.group("AUTH MIDDLEWARE");
    console.log("→ Raw Authorization Header:", header);
    console.log("→ Extracted Token:", header ? header.slice(7) : "NO HEADER");
    console.groupEnd();

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // ============================
        // LOG DECODED PAYLOAD
        // ============================
        console.group("AUTH PAYLOAD");
        console.log("→ Decoded Payload:", payload);
        console.groupEnd();

        req.user = {
            user_id: payload.user_id,
            username: payload.username,
            roles: payload.roles || [],
            modules: payload.modules || {}
        };

        next();
    } catch (err) {
        console.error("→ JWT VERIFY ERROR:", err);
        return res.status(401).json({ error: "Invalid token" });
    }
};

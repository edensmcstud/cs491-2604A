const { query } = require("../utils/db");

module.exports = async function authCustomer(req, res, next) {
    try {
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "Missing customer session token" });
        }

        // Strip Bearer prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        // Look up customer session
        const rows = await query(
            `SELECT 
                customers.id,
                customers.username,
                customers.email,
                customers.session_token,
                customers.session_expires_at
             FROM customers
             WHERE customers.session_token = ?`,
            [token]
        );

        const customer = rows[0];

        if (!customer) {
            return res.status(401).json({ error: "Invalid customer session token" });
        }

        // Check expiry
        if (Date.now() > customer.session_expires_at) {
            return res.status(401).json({ error: "Customer session expired" });
        }

        // Attach customer identity
        req.customer = {
            id: customer.id,
            username: customer.username,
            email: customer.email
        };

        next();
    } catch (err) {
        console.error("authCustomer error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

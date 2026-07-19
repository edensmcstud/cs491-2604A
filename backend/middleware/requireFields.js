// backend/middleware/requireFields.js
module.exports = function requireFields(fields) {
    return (req, res, next) => {
        for (const f of fields) {
            if (!req.body[f]) {
                return res.status(400).json({ error: `${f} is required` });
            }
        }
        next();
    };
};

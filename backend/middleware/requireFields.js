module.exports = function requireFields(fields) {
    return (req, res, next) => {
        for (const f of fields) {
            const value = req.body[f];

            // Reject missing, null, or empty-string values
            if (value === undefined || value === null || value === "") {
                return res.status(400).json({ error: `${f} is required` });
            }
        }

        next();
    };
};

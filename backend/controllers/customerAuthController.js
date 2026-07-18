module.exports.registerCustomer = (req, res) => {
    res.json({
        todo: "Implement customer registration (Sprint 2)",
        required: [
            "Validate customer fields",
            "Hash password",
            "Insert customer into database",
            "Return registration confirmation"
        ]
    });
};

module.exports.loginCustomer = (req, res) => {
    res.json({
        todo: "Implement customer login (Sprint 2)",
        required: [
            "Validate email/password",
            "Hash + compare password",
            "Generate session/JWT",
            "Return customer session token"
        ]
    });
};

// TODO Sprint 1:
// Add bcrypt, jwt, and User model imports when implementing login

module.exports.getAuth = (req, res) => {
    res.json({
        todo: "Implement employee auth list or dashboard (Sprint 1)"
    });
};

module.exports.login = async (req, res) => {
    res.json({
        todo: "Implement employee login (Sprint 1)",
        required: [
            "Validate username/password",
            "Hash + compare password",
            "Generate session/JWT",
            "Return employee session token"
        ]
    });
};

module.exports.logout = (req, res) => {
    res.json({
        todo: "Implement employee logout (Sprint 1)",
        required: [
            "Clear session/JWT",
            "Return logout confirmation"
        ]
    });
};

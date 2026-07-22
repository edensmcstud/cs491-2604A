// backend/controllers/authController.js

const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Users.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const valid = await user.verifyPassword(password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const roles = await Users.getRoles(user.user_id);

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                roles
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// Added to fix crash
exports.logout = (req, res) => {
    res.json({ message: "Logged out" });
};

// Added to fix crash
exports.test = (req, res) => {
    res.json({ message: "auth controller test" });
};

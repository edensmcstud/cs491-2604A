exports.register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // 1. Basic presence checks
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            errorCode: "MISSING_FIELDS",
            message: "Username, email, password, and confirmPassword are required."
        });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            errorCode: "INVALID_EMAIL",
            message: "Email format is invalid."
        });
    }

    // 3. Password match
    if (password !== confirmPassword) {
        return res.status(400).json({
            errorCode: "PASSWORD_MISMATCH",
            message: "Passwords do not match."
        });
    }

    // 4. Password strength
    if (password.length < 8) {
        return res.status(400).json({
            errorCode: "WEAK_PASSWORD",
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        // 5. Username uniqueness
        const existingUsername = await Users.findByUsername(username);
        if (existingUsername) {
            return res.status(409).json({
                errorCode: "USERNAME_EXISTS",
                message: "That username is already taken."
            });
        }

        // 6. Email uniqueness
        const existingEmail = await Users.findByEmail(email);
        if (existingEmail) {
            return res.status(409).json({
                errorCode: "EMAIL_EXISTS",
                message: "An account with this email already exists."
            });
        }

        // 7. Create user (model handles hashing + SQL)
        const newUser = await Users.create(username, email, password);

        // 8. Return success
        return res.status(201).json({
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.created_at
        });

    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({
            errorCode: "SERVER_ERROR",
            message: "An unexpected error occurred."
        });
    }
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");

    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const result = await register(username, email, password, confirmPassword);

            // Registration succeeded → go to login
            navigate("/login");

        } catch (err) {
            const data = err.response?.data;

            // Backend sends: { errorCode, message }
            if (data?.errorCode) {
                setError(data.message);
            } else {
                setError("Registration failed");
            }
        }
    }

    return (
        <div className="page">
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Register</button>
            </form>

            <div className="auth-link">
                <a href="/login">Already have an account?</a>
            </div>
        </div>
    );
}

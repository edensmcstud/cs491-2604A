import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const result = await login(username, password);
            navigate("/dashboard");

        } catch (err) {
            const data = err.response?.data;

            // Prefer backend message → fallback to backend error → fallback to generic
            setError(
                data?.message ||
                data?.error ||
                "Login failed"
            );
        }
    }

    return (
        <div className="page">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit">Login</button>
            </form>

            <div className="auth-link">
                <a href="/register">Create an account</a>
            </div>
        </div>
    );
}

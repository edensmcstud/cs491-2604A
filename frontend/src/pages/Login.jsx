import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault(); // CRITICAL: stops raw form POST
        setError("");

        console.log("Submitting login:", { username, password });

        try {
            const result = await login(username, password);
            console.log("Login result:", result);

            navigate("/dashboard");
        } catch (err) {
            console.log("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="page">
            <h1>Login</h1>

            {/* CRITICAL FIX: onSubmit handler */}
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

                {/* CRITICAL FIX: type="submit" */}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

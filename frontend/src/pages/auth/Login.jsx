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

            setError(
                data?.message ||
                data?.error ||
                "Login failed"
            );
        }
    }

    return (
        <div className="page">

            {/* Custom Branding Header for Login Screen */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'inline-block', margin: '0 auto' }}>
                    <svg
                        xmlns="http://w3.org"
                        viewBox="0 0 100 100"
                        width="120"
                        height="120"
                        style={{ display: 'block', margin: '0 auto' }}
                    >
                        <path
                            fill="currentColor"
                            style={{ color: 'var(--text-h, #ffffff)' }}
                            d="M50,57.5 C50,57.5 41,53 29,53 L29,28 C41,28 50,32.5 50,32.5 Z M50,57.5 C50,57.5 59,53 71,53 L71,28 C59,28 50,32.5 50,32.5 Z"
                        />
                        <path
                            fill="currentColor"
                            style={{ color: 'var(--text-h, #ffffff)' }}
                            d="M50,54 C50,54 43,49.5 36.5,49.5 L36.5,24.5 C43,24.5 50,29 50,29 Z M50,54 C50,54 57,49.5 63.5,49.5 L63.5,24.5 C57,24.5 50,29 50,29 Z"
                        />
                    </svg>

                    <div style={{
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: 'var(--text-h, #ffffff)',
                        borderTop: '2px solid #f3a4b1',
                        borderBottom: '2px solid #f3a4b1',
                        padding: '6px 16px',
                        marginTop: '12px',
                        display: 'inline-block'
                    }}>
                        Book Store
                    </div>
                </div>
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    maxWidth: '320px',
                    margin: '0 auto',
                    textAlign: 'left'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text)' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text)' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                </div>

                {error && <p style={{ color: "red", margin: '5px 0 0 0' }}>{error}</p>}

                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Login
                </button>
            </form>

            <div className="auth-link">
                <a href="/register">Create an account</a>
            </div>
        </div>
    );
}

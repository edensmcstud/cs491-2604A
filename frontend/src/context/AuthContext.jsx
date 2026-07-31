import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    async function login(username, password) {
        const result = await api.post("/auth/login", { username, password });

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);

        return result;
    }

    // Register function — FIXED to correctly throw Axios errors
    async function register(username, email, password, confirmPassword) {
        try {
            const response = await api.post("/auth/register", {
                username,
                email,
                password,
                confirmPassword
            });

            return response; // success
        } catch (err) {
            throw err; // IMPORTANT: let Register.jsx handle errorCode + message
        }
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

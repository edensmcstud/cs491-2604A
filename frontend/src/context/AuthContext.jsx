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

        // Store token
        localStorage.setItem("token", result.token);

        // Store full user object (roles, modules, user_id, username)
        localStorage.setItem("user", JSON.stringify(result.user));

        // Set full user object in state
        setUser(result.user);

        return result;
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

import { createContext, useContext, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    async function login(username, password) {
        console.group("AUTH LOGIN");
        console.log("→ Attempting login with:", { username, password });
        console.groupEnd();

        const result = await api.post("/auth/login", { username, password });

        console.group("AUTH LOGIN SUCCESS");
        console.log("→ Received token:", result.token);
        console.groupEnd();

        // CRITICAL FIX: Save token + user
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify({ username }));

        setUser({ username });

        return result;
    }

    function logout() {
        console.group("AUTH LOGOUT");
        console.log("→ Clearing session");
        console.groupEnd();

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

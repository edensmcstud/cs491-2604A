import axios from "axios";

// Base URL for your Express backend
const API_URL = "http://localhost:3000/api";

// Create a reusable axios instance
const api = axios.create({
    baseURL: API_URL,
});

// GET helper
export async function get(path) {
    try {
        const response = await api.get(path);
        return response.data;
    } catch (err) {
        console.error("GET error:", err);
        throw err;
    }
}

// POST helper
export async function post(path, body) {
    try {
        const response = await api.post(path, body);
        return response.data;
    } catch (err) {
        console.error("POST error:", err);
        throw err;
    }
}

// PUT helper
export async function put(path, body) {
    try {
        const response = await api.put(path, body);
        return response.data;
    } catch (err) {
        console.error("PUT error:", err);
        throw err;
    }
}

// DELETE helper
export async function del(path) {
    try {
        const response = await api.delete(path);
        return response.data;
    } catch (err) {
        console.error("DELETE error:", err);
        throw err;
    }
}

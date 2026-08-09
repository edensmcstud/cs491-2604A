import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Create axios instance
const client = axios.create({
    baseURL: API_URL,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
client.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

// =========================
// API WRAPPER
// =========================
const api = {
    async get(path) {
        const res = await client.get(path);
        return res.data;
    },

    async post(path, body) {
        const res = await client.post(path, body);
        return res.data;
    },

    async put(path, body) {
        const res = await client.put(path, body);
        return res.data;
    },

    async delete(path) {
        const res = await client.delete(path);
        return res.data;
    },

    async patch(path, body) {
        const res = await client.patch(path, body);
        return res.data;
    },
};

export default api;
export { client };

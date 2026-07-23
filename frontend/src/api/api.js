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

        console.group("API REQUEST");
        console.log("→ Method:", config.method.toUpperCase());
        console.log("→ URL:", config.baseURL + config.url);
        console.log("→ Request Body:", config.data);
        console.log("→ Current Token:", token ? token : "NO TOKEN FOUND");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("→ Authorization Header Set");
        } else {
            console.warn("→ WARNING: Authorization Header NOT Set");
        }

        console.groupEnd();

        return config;
    },
    (error) => {
        console.group("API REQUEST ERROR");
        console.error("→ Request Interceptor Error:", error);
        console.groupEnd();
        return Promise.reject(error);
    }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
client.interceptors.response.use(
    (response) => {
        console.group("API RESPONSE");
        console.log("→ Status:", response.status);
        console.log("→ URL:", response.config.url);
        console.log("→ Response Data:", response.data);
        console.groupEnd();

        return response;
    },

    (error) => {
        const status = error.response?.status;
        const url = error.response?.config?.url;

        console.group("API RESPONSE ERROR");
        console.error("→ Status:", status);
        console.error("→ URL:", url);
        console.error("→ Error Data:", error.response?.data);
        console.error("→ Full Error Object:", error);
        console.groupEnd();

        // Handle 401 Unauthorized
        if (status === 401) {
            console.group("SESSION WIPE TRIGGERED");
            console.warn("→ 401 Unauthorized detected");
            console.warn("→ Removing user + token from localStorage");
            console.warn("→ Redirecting to /login");
            console.groupEnd();

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
        console.group("API WRAPPER CALL: GET");
        console.log("→ Path:", path);
        console.groupEnd();

        const res = await client.get(path);
        return res.data;
    },

    async post(path, body) {
        console.group("API WRAPPER CALL: POST");
        console.log("→ Path:", path);
        console.log("→ Body:", body);
        console.groupEnd();

        const res = await client.post(path, body);
        return res.data;
    },

    async put(path, body) {
        console.group("API WRAPPER CALL: PUT");
        console.log("→ Path:", path);
        console.log("→ Body:", body);
        console.groupEnd();

        const res = await client.put(path, body);
        return res.data;
    },

    async delete(path) {
        console.group("API WRAPPER CALL: DELETE");
        console.log("→ Path:", path);
        console.groupEnd();

        const res = await client.delete(path);
        return res.data;
    },
};

export default api;
export { client };

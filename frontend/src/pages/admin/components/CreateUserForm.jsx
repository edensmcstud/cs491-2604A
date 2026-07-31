import { useState } from "react";
import api from "../../../api/api";

export default function CreateUserForm({ onSuccess, onCancel }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "Employee"   // default for admin-created accounts
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/users", {
                username: form.username,
                email: form.email,
                password: form.password,
                role: form.role
            });

            onSuccess();
        } catch (err) {
            console.error("Create user error:", err);
            alert("Failed to create user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Employee/Admin</h2>

            <label>Username</label>
            <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
            />

            <label>Email</label>
            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
            />

            <label>Password</label>
            <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
            />

            <label>Role</label>
            <select
                name="role"
                value={form.role}
                onChange={handleChange}
            >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
            </select>

            <div style={{ marginTop: "1rem" }}>
                <button type="submit">Create</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

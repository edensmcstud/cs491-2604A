import { useState } from "react";
import api from "../../../api/api";

export default function EditUserForm({ user, onSuccess, onCancel }) {
    const [form, setForm] = useState({
        username: user.username,
        email: user.email,
        role: user.roles?.[0] || "Customer"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Update role (single-role model)
            await api.put(`/admin/users/${user.user_id}/role`, {
                role: form.role
            });

            // OPTIONAL: username/email update (future backend support)
            // await api.put(`/admin/users/${user.user_id}`, {
            //     username: form.username,
            //     email: form.email
            // });

            onSuccess();
        } catch (err) {
            console.error("Edit user error:", err);
            alert("Failed to update user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit User</h2>

            <label>Username</label>
            <input
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled
            />

            <label>Email</label>
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
            />

            <label>Role</label>
            <select
                name="role"
                value={form.role}
                onChange={handleChange}
            >
                <option value="Customer">Customer</option>
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
            </select>

            <div style={{ marginTop: "1rem" }}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

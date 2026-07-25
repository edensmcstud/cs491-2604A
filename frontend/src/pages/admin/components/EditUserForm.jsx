import { useState } from "react";
import api from "../../../api/api";

export default function EditUserForm({ user, onDone, onClose }) {
    const [form, setForm] = useState({
        username: user.username,
        email: user.email
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/users/${user.user_id}`, {
                username: form.username,
                email: form.email
            });

            onDone();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit User</h2>

            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required />

            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}

import { useState } from "react";
import api from "../../../api/api";

export default function CreateUserForm({ onDone, onClose }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        roles: []
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/users", {
                username: form.username,
                email: form.email,
                password: form.password,
                roles: form.roles.length ? form.roles : undefined
            });

            onDone();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create User</h2>

            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />

            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required />

            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />

            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}

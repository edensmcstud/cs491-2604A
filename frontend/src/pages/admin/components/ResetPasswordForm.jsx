import { useState } from "react";
import api from "../../../api/api";

export default function ResetPasswordForm({ user, onDone, onClose }) {
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/users/${user.user_id}/password`, {
                password
            });

            onDone();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to reset password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>

            <label>New Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Reset</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}

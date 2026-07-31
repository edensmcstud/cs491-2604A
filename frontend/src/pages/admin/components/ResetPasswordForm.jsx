import { useState } from "react";
import api from "../../../api/api";

export default function ResetPasswordForm({ user, onSuccess, onCancel }) {
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/admin/users/${user.user_id}/password`, {
                password
            });

            onSuccess();
        } catch (err) {
            console.error("Reset password error:", err);
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

            <div style={{ marginTop: "1rem" }}>
                <button type="submit">Reset</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

import api from "../../../api/api";

export default function DeleteUserConfirm({ user, onSuccess, onCancel }) {
    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${user.user_id}`);
            onSuccess();
        } catch (err) {
            console.error("Delete user error:", err);
            alert("Failed to delete user");
        }
    };

    return (
        <div>
            <h2>Delete User</h2>
            <p>Are you sure you want to delete <strong>{user.username}</strong>?</p>

            <button onClick={handleDelete} style={{ marginRight: "1rem" }}>
                Delete
            </button>
            <button onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}

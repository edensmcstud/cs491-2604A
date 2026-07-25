import api from "../../../api/api";

export default function DeleteUserConfirm({ user, onDone, onClose }) {
    const handleDelete = async () => {
        try {
            await api.delete(`/users/${user.user_id}`);
            onDone();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to deactivate user");
        }
    };

    return (
        <div>
            <h2>Deactivate User</h2>
            <p>Are you sure you want to deactivate {user.username}?</p>

            <button onClick={handleDelete}>Deactivate</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
}

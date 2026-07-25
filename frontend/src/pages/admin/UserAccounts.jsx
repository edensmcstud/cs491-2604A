import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

export default function UserAccounts() {
    const [users, setUsers] = useState([]); // always an array
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        loadUsersStub();   // backend forbidden → stub
    }, []);

    // -----------------------------
    // FUTURE IMPROVEMENT: /api/users
    // -----------------------------
    const loadUsersStub = () => {
        console.warn("FUTURE IMPROVEMENT: /api/users backend not available or forbidden");

        const stub = [
            { user_id: 1, username: "admin", email: "admin@example.com" },
            { user_id: 2, username: "manager", email: "manager@example.com" },
            { user_id: 3, username: "staff", email: "staff@example.com" }
        ];

        setUsers(Array.isArray(stub) ? stub : []);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const saveUser = async () => {
        console.warn("FUTURE IMPROVEMENT: saveUser backend not implemented");

        alert("User updated (stub mode)");
        setShowModal(false);
    };

    return (
        <div className="page">
            <h1>User Accounts</h1>

            <p style={{ color: "orange", fontWeight: "bold" }}>
                FUTURE IMPROVEMENT: User management will be connected to backend once
                /api/users and related routes are implemented.
            </p>

            <Table
                columns={["ID", "Username", "Email", "Actions"]}
                data={Array.isArray(users) ? users.map((u) => ({
                    ID: u.user_id,
                    Username: u.username,
                    Email: u.email,
                    Actions: (
                        <button onClick={() => openEditModal(u)}>
                            Edit
                        </button>
                    )
                })) : []}
            />

            {showModal && selectedUser && (
                <Modal onClose={() => setShowModal(false)}>
                    <div>
                        <h2>Edit User: {selectedUser.username}</h2>

                        <p>Email: {selectedUser.email}</p>

                        <button onClick={saveUser}>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

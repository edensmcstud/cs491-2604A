import { useState, useEffect } from "react";
import api from "../../api/api";

import Table from "../../components/Table";
import Modal from "../../components/Modal";

import CreateUserForm from "./components/CreateUserForm";
import EditUserForm from "./components/EditUserForm";
import DeleteUserConfirm from "./components/DeleteUserConfirm";

export default function UserAccounts() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalType, setModalType] = useState(null); // "create" | "edit" | "delete"
    const [selectedUser, setSelectedUser] = useState(null);

    // Load users from backend
    async function loadUsers() {
        try {
            setLoading(true);
            const data = await api.get("/admin/users");
            setUsers(data);
        } catch (err) {
            console.error("Load users error:", err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    // Open modals
    const openCreateModal = () => {
        setSelectedUser(null);
        setModalType("create");
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setModalType("edit");
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setModalType("delete");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    // After any action, reload users
    const refresh = async () => {
        await loadUsers();
        closeModal();
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page">
            <h1>User Accounts</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={openCreateModal} style={{ marginBottom: "1rem" }}>
                Create Employee/Admin
            </button>

            <Table
                columns={["User ID", "Customer ID", "Username", "Email", "Role", "Actions"]}
                data={users.map((u) => ({
                    "User ID": u.user_id,
                    "Customer ID": u.customer_id ?? "—",
                    Username: u.username,
                    Email: u.email,
                    Role: u.roles?.[0] || "Customer",
                    Actions: (
                        <>
                            <button onClick={() => openEditModal(u)}>Edit</button>
                            <button onClick={() => openDeleteModal(u)}>Delete</button>
                        </>
                    )
                }))}
            />

            {/* Modal Controller */}
            {modalType && (
                <Modal onClose={closeModal}>
                    {modalType === "create" && (
                        <CreateUserForm onSuccess={refresh} onCancel={closeModal} />
                    )}

                    {modalType === "edit" && selectedUser && (
                        <EditUserForm
                            user={selectedUser}
                            onSuccess={refresh}
                            onCancel={closeModal}
                        />
                    )}

                    {modalType === "delete" && selectedUser && (
                        <DeleteUserConfirm
                            user={selectedUser}
                            onSuccess={refresh}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
}

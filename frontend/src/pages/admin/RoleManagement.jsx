import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

export default function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedRole, setSelectedRole] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadRoles();
        loadUsers();
    }, []);

    // Load roles from backend
    const loadRoles = async () => {
        try {
            const data = await api.get("/admin/roles");
            setRoles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load roles:", err);
            setRoles([]);
        }
    };

    // Load users from backend
    const loadUsers = async () => {
        try {
            const data = await api.get("/admin/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load users:", err);
            setUsers([]);
        }
    };

    return (
        <div className="page">
            <h1>Role Management</h1>

            <p style={{ color: "orange", fontWeight: "bold" }}>
                This page shows roles and which users belong to each role.
                Role assignment is handled in the User Accounts page.
            </p>

            <h2>Roles</h2>
            <Table
                columns={["ID", "Role Name", "Users", "Actions"]}
                data={roles.map((r) => {
                    const usersInRole = users.filter(
                        (u) => u.roles?.[0] === r.role_name
                    );

                    return {
                        ID: r.role_id,
                        "Role Name": r.role_name,
                        Users: usersInRole.map((u) => u.username).join(", ") || "None",
                        Actions: (
                            <button
                                onClick={() => {
                                    setSelectedRole(r);
                                    setShowModal(true);
                                }}
                            >
                                View Details
                            </button>
                        )
                    };
                })}
            />

            {showModal && selectedRole && (
                <Modal onClose={() => setShowModal(false)}>
                    <div>
                        <h2>Role Details: {selectedRole.role_name}</h2>

                        <h3>Users with this role</h3>
                        <ul>
                            {users
                                .filter((u) => u.roles?.[0] === selectedRole.role_name)
                                .map((u) => (
                                    <li key={u.user_id}>{u.username}</li>
                                ))}
                        </ul>

                        <p style={{ marginTop: "1rem", color: "gray" }}>
                            Future enhancement: Edit role permissions here.
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    );
}

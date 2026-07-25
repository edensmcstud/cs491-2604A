import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

export default function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]); // always an array

    const [selectedRole, setSelectedRole] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadRoles();
        loadUsersStub();   // backend not available → stub
    }, []);

    // -----------------------------
    // LOAD ROLES (REAL ENDPOINT)
    // -----------------------------
    const loadRoles = async () => {
        try {
            const res = await api.get("/roles");
            setRoles(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load roles:", err);
            setRoles([]);
        }
    };

    // -----------------------------
    // FUTURE IMPROVEMENT: /api/users
    // -----------------------------
    const loadUsersStub = () => {
        console.warn("FUTURE IMPROVEMENT: /api/users backend not implemented or forbidden");

        const stub = [
            { user_id: 1, username: "admin" },
            { user_id: 2, username: "manager" },
            { user_id: 3, username: "staff" }
        ];

        setUsers(Array.isArray(stub) ? stub : []);
    };

    const assignRole = async () => {
        console.warn("FUTURE IMPROVEMENT: assignRole backend not implemented");

        alert("Role assigned (stub mode)");
        setShowModal(false);
    };

    return (
        <div className="page">
            <h1>Role Management</h1>

            <p style={{ color: "orange", fontWeight: "bold" }}>
                FUTURE IMPROVEMENT: User-role assignment will be connected to backend
                once /api/users and /api/roles/:id endpoints are implemented.
            </p>

            <h2>Roles</h2>
            <Table
                columns={["ID", "Role Name", "Actions"]}
                data={Array.isArray(roles) ? roles.map((r) => ({
                    ID: r.role_id,
                    Name: r.role_name,
                    Actions: (
                        <button
                            onClick={() => {
                                setSelectedRole(r);
                                setShowModal(true);
                            }}
                        >
                            Assign Role
                        </button>
                    )
                })) : []}
            />

            {showModal && selectedRole && (
                <Modal onClose={() => setShowModal(false)}>
                    <div>
                        <h2>Assign {selectedRole.role_name} Role</h2>

                        <table className="permission-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Assign</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) &&
                                    users.map((u) => (
                                        <tr key={u.user_id}>
                                            <td>{u.username}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => { }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        <button onClick={assignRole}>Save</button>
                        <button onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

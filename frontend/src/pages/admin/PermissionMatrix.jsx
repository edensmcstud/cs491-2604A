import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

export default function PermissionMatrix() {
    // Always arrays → prevents .map crashes
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);

    const [selectedRole, setSelectedRole] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);

    useEffect(() => {
        loadRoles();
        loadPermissionsStub();   // backend not implemented
    }, []);

    // -----------------------------
    // LOAD ROLES (REAL ENDPOINT)
    // -----------------------------
    const loadRoles = async () => {
        try {
            const res = await api.get("/roles");

            // Guarantee array
            const safe = Array.isArray(res.data) ? res.data : [];
            setRoles(safe);
        } catch (err) {
            console.error("Failed to load roles:", err);
            setRoles([]); // prevent crash
        }
    };

    // -----------------------------
    // FUTURE IMPROVEMENT: Permissions API
    // -----------------------------
    const loadPermissionsStub = () => {
        // Stubbed permissions until backend exists
        const stub = [
            { module: "books", action: "read" },
            { module: "books", action: "write" },
            { module: "inventory", action: "read" },
            { module: "inventory", action: "write" },
            { module: "sales", action: "read" },
            { module: "sales", action: "write" }
        ];

        setPermissions(Array.isArray(stub) ? stub : []);
    };

    // -----------------------------
    // FUTURE IMPROVEMENT: Role Permissions API
    // -----------------------------
    const loadRolePermissions = async (role_id) => {
        console.warn("FUTURE IMPROVEMENT: loadRolePermissions backend not implemented");

        // Start with empty permissions
        setRolePermissions([]);
    };

    // Toggle permission in local state only
    const togglePermission = (module, action) => {
        const exists = rolePermissions.some(
            (p) => p.module === module && p.action === action
        );

        if (exists) {
            setRolePermissions(
                rolePermissions.filter(
                    (p) => !(p.module === module && p.action === action)
                )
            );
        } else {
            setRolePermissions([
                ...rolePermissions,
                { module, action }
            ]);
        }
    };

    // -----------------------------
    // FUTURE IMPROVEMENT: Save Permissions API
    // -----------------------------
    const savePermissions = async () => {
        console.warn("FUTURE IMPROVEMENT: savePermissions backend not implemented");

        alert("Permissions updated (stub mode)");
        setShowRoleModal(false);
    };

    return (
        <div className="page">
            <h1>Permission Matrix</h1>

            <p style={{ color: "orange", fontWeight: "bold" }}>
                FUTURE IMPROVEMENT: Permission data will be loaded from the backend once
                /api/permissions and /permissions/role/:id routes are implemented.
            </p>

            <h2>Select Role</h2>

            <Table
                columns={["ID", "Role Name", "Actions"]}
                data={Array.isArray(roles) ? roles.map((r) => ({
                    ID: r.role_id,
                    Name: r.role_name,
                    Actions: (
                        <button
                            onClick={() => {
                                setSelectedRole(r);
                                loadRolePermissions(r.role_id);
                                setShowRoleModal(true);
                            }}
                        >
                            Edit Permissions
                        </button>
                    )
                })) : []}
            />

            {showRoleModal && selectedRole && (
                <Modal onClose={() => setShowRoleModal(false)}>
                    <div>
                        <h2>Edit Permissions for {selectedRole.role_name}</h2>

                        <table className="permission-table">
                            <thead>
                                <tr>
                                    <th>Module</th>
                                    <th>Action</th>
                                    <th>Allowed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(permissions) &&
                                    permissions.map((perm) => {
                                        const hasPerm = rolePermissions.some(
                                            (p) =>
                                                p.module === perm.module &&
                                                p.action === perm.action
                                        );

                                        return (
                                            <tr key={`${perm.module}-${perm.action}`}>
                                                <td>{perm.module}</td>
                                                <td>{perm.action}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={hasPerm}
                                                        onChange={() =>
                                                            togglePermission(
                                                                perm.module,
                                                                perm.action
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>

                        <button onClick={savePermissions}>Save</button>
                        <button onClick={() => setShowRoleModal(false)}>
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

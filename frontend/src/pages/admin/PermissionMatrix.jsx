import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";

export default function PermissionMatrix() {
    const [matrix, setMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            setLoading(true);

            // FUTURE BACKEND ENDPOINT:
            // GET /admin/permissions
            const data = await api.get("/admin/permissions");

            setMatrix(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load permission matrix:", err);
            setError("Permission matrix backend not implemented yet");
            setMatrix([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page">
            <h1>Permission Matrix</h1>

            {error && (
                <p style={{ color: "orange", fontWeight: "bold" }}>
                    {error}
                </p>
            )}

            <Table
                columns={["Role", "Permissions"]}
                data={matrix.map((entry) => ({
                    Role: entry.role_name,
                    Permissions: entry.permissions
                        .map((p) => `${p.module}:${p.action}`)
                        .join(", ")
                }))}
            />
        </div>
    );
}

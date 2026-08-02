import { useState, useEffect } from "react";
import api from "../../api/api";
import Table from "../../components/Table";

export default function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAuditLog();
    }, []);

    const loadAuditLog = async () => {
        try {
            setLoading(true);

            // FUTURE BACKEND ENDPOINT:
            // GET /admin/audit-log
            const data = await api.get("/admin/audit-log");

            setLogs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load audit log:", err);
            setError("Audit log backend not implemented yet");
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="page">
            <h1>Audit Log</h1>

            {error && (
                <p style={{ color: "orange", fontWeight: "bold" }}>
                    {error}
                </p>
            )}

            <Table
                columns={["User", "Action", "Timestamp"]}
                data={logs.map((entry) => ({
                    User: entry.username,
                    Action: entry.action,
                    Timestamp: entry.timestamp
                }))}
            />
        </div>
    );
}

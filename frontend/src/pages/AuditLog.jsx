export default function AuditLog() {
    return (
        <div className="page">
            <h1>Audit Log</h1>

            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

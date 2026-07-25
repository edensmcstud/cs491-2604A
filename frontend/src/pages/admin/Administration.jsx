import { Link } from "react-router-dom";

export default function Administration() {
    return (
        <div className="page">
            <h1>Administration</h1>

            <p>Select an administrative function:</p>

            <ul>
                <li><Link to="/admin/audit-log">Audit Log</Link></li>
                <li><Link to="/admin/permissions">Permission Matrix</Link></li>
                <li><Link to="/admin/roles">Role Management</Link></li>
                <li><Link to="/admin/users">User Accounts</Link></li>
            </ul>
        </div>
    );
}

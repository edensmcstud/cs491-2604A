import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="page">
            <h1>Dashboard</h1>

            <div style={{ marginBottom: "20px" }}>
                <p>Welcome, {user?.username}</p>
                <button onClick={logout}>Logout</button>
            </div>

            <h2>Available Sections</h2>

            <ul>
                <li><Link to="/inventory">Inventory</Link></li>
                <li><Link to="/sales">Sales</Link></li>
                <li><Link to="/customer-orders">Customer Orders</Link></li>
                <li><Link to="/supplier-orders">Supplier Orders</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                <li><Link to="/audit-log">Audit Log</Link></li>
                <li><Link to="/role-management">Role Management</Link></li>
            </ul>
        </div>
    );
}

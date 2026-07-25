import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();

    // Permission checker based on your backend's "modules" structure
    const can = (module, action = "read") =>
        user?.modules?.[module]?.[action] === true;

    return (
        <div className="page">
            <h1>Dashboard</h1>

            <div style={{ marginBottom: "20px" }}>
                <p>Welcome, {user?.username}</p>
                <button onClick={logout}>Logout</button>
            </div>

            <h2>Available Sections</h2>

            <ul>
                {can("books") && (
                    <li><Link to="/books">Books</Link></li>
                )}

                {can("inventory") && (
                    <li><Link to="/inventory">Inventory</Link></li>
                )}

                {can("sales") && (
                    <li><Link to="/sales">Sales</Link></li>
                )}

                {can("customer_orders") && (
                    <li><Link to="/customer-orders">Customer Orders</Link></li>
                )}

                {can("supplier_orders") && (
                    <li><Link to="/supplier-orders">Supplier Orders</Link></li>
                )}

                {can("audit_logs") && (
                    <li><Link to="/audit-log">Audit Log</Link></li>
                )}

                {can("roles") && (
                    <li><Link to="/role-management">Role Management</Link></li>
                )}
            </ul>
        </div>
    );
}

import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li><Link to="/inventory">Inventory</Link></li>
                    <li><Link to="/sales">Sales</Link></li>
                    <li><Link to="/customer-orders">Customer Orders</Link></li>
                    <li><Link to="/supplier-orders">Supplier Orders</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/audit-log">Audit Log</Link></li>
                    <li><Link to="/role-management">Role Management</Link></li>
                </ul>
            </nav>
        </aside>
    );
}

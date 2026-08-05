import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    console.log(user.modules);

    const canAny = (module) => {
        const perms = user?.modules?.[module];
        return perms && Object.values(perms).some(v => v === true);
    };

    const isAdmin = user?.roles?.includes("Admin");

    return (
        <div className="page">
            <h1>Dashboard</h1>

            <div style={{ marginBottom: "20px" }}>
                <p>Welcome, {user?.username}</p>
            </div>

            <h2>Available Sections</h2>

            <ul>
                {canAny("books") && (
                    <li><Link to="/books">Books</Link></li>
                )}

                {canAny("inventory") && (
                    <li><Link to="/inventory">Inventory</Link></li>
                )}

                {canAny("sales") && (
                    <li><Link to="/sales">Sales History</Link></li>
                )}

                {canAny("customer_orders") && (
                    <li><Link to="/orders/customers">Customer Orders</Link></li>
                )}

                {canAny("customer_orders") && (
                    <li><Link to="/orders/fulfillment">Order Fulfillment</Link></li>
                )}


                {canAny("supplier_orders") && (
                    <li><Link to="/orders/suppliers">Supplier Orders</Link></li>
                )}


                {canAny("reports") && (
                    <li><Link to="/reports">Reports</Link></li>
                )}

                {isAdmin && (
                    <li><Link to="/admin">Administration</Link></li>
                )}
            </ul>
        </div>
    );
}

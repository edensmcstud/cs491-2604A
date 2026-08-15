import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user } = useAuth();

    const canAny = (module) => {
        const perms = user?.modules?.[module];
        return perms && Object.values(perms).some(v => v === true);
    };

    const isAdmin = user?.roles?.includes("Admin");
    const isEmployee = user?.roles?.includes("Employee");
    const isCustomer = user?.roles?.includes("Customer");

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>

                    {/* Shared */}
                    <li><Link to="/dashboard">Dashboard</Link></li>

                    {/* Customer */}
                    {isCustomer && (
                        <>
                            {canAny("books") && (
                                <li><Link to="/books">Browse Books</Link></li>
                            )}
                        </>
                    )}

                    {/* Employee/Admin */}
                    {(isEmployee || isAdmin) && (
                        <>
                            {canAny("customer_orders") && (
                                <li><Link to="/pos">Point of Sale</Link></li>
                            )}

                            {canAny("inventory") && (
                                <li><Link to="/inventory">Inventory</Link></li>
                            )}

                            {canAny("customer_orders") && (
                                <li><Link to="/orders/fulfillment">Order Fulfillment</Link></li>
                            )}

                            {canAny("sales") && (
                                <li><Link to="/sales">Sales History</Link></li>
                            )}

                            {canAny("supplier_orders") && (
                                <li><Link to="/orders/suppliers">Supplier Orders</Link></li>
                            )}

                            {canAny("reports") && (
                                <li><Link to="/reports">Reports</Link></li>
                            )}
                        </>
                    )}

                    {/* Admin-only */}
                    {isAdmin && (
                        <li><Link to="/admin">Administration</Link></li>
                    )}

                </ul>
            </nav>
        </aside>
    );
}

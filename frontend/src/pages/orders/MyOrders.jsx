import { useCallback, useEffect, useState } from "react";
import api from "../../api/api";

const money = value => Number(value || 0).toFixed(2);

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await api.get("/orders/mine");
            setOrders(Array.isArray(data.orders) ? data.orders : []);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load your orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    async function cancelOrder(orderId) {
        setError("");
        setCancellingId(orderId);

        try {
            await api.post(`/orders/${orderId}/cancel`, {});
            await loadOrders();
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to cancel order.");
        } finally {
            setCancellingId(null);
        }
    }

    return (
        <div className="page">
            <div className="page-heading-row">
                <div>
                    <h1>My Orders</h1>
                    <p className="page-subtitle">Track your orders and cancel any that haven't shipped yet.</p>
                </div>
                <button className="secondary-button" onClick={loadOrders} disabled={loading}>Refresh</button>
            </div>

            {error && <div className="form-error">{error}</div>}
            {loading && <p>Loading your orders...</p>}

            {!loading && orders.length === 0 && (
                <div className="empty-state">
                    <h2>No orders yet</h2>
                    <p>Orders you place will show up here.</p>
                </div>
            )}

            {!loading && orders.length > 0 && (
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Status</th>
                                <th className="numeric-cell">Total</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id}>
                                    <td><strong>#{order.order_id}</strong></td>
                                    <td>{order.order_date}</td>
                                    <td>{order.items?.map(item => `${item.title} × ${item.quantity}`).join(", ")}</td>
                                    <td><span className="status-badge status-healthy">{order.status}</span></td>
                                    <td className="numeric-cell">${money(order.total)}</td>
                                    <td className="actions-cell">
                                        {order.status === "Pending" && (
                                            <button
                                                className="secondary-button"
                                                disabled={cancellingId === order.order_id}
                                                onClick={() => cancelOrder(order.order_id)}
                                            >
                                                {cancellingId === order.order_id ? "Cancelling..." : "Cancel"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

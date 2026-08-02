import { useCallback, useEffect, useState } from "react";
import api from "../../api/api";

const money = value => Number(value || 0).toFixed(2);

export default function OrderFulfillment() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [workingId, setWorkingId] = useState(null);
    const [fulfillmentTypes, setFulfillmentTypes] = useState({});

    const loadPendingOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await api.get("/orders/pending");
            setOrders(Array.isArray(data?.orders) ? data.orders : []);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load pending orders.");
        } finally {
            setLoading(false);
        }
    }, []);

    async function fulfillOrder(orderId) {
        try {
            setWorkingId(orderId);
            setError("");
            await api.post(`/orders/${orderId}/fulfill`, {
                fulfillment_type: fulfillmentTypes[orderId] || "Shipped"
            });
            await loadPendingOrders();
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to fulfill the order.");
        } finally {
            setWorkingId(null);
        }
    }

    useEffect(() => {
        loadPendingOrders();
    }, [loadPendingOrders]);

    return (
        <div className="page order-fulfillment-page">
            <div className="page-heading-row">
                <div>
                    <h1>Order Fulfillment</h1>
                    <p className="page-subtitle">Customer checkouts appear here until they are fulfilled.</p>
                </div>
                <button className="secondary-button" onClick={loadPendingOrders} disabled={loading}>
                    Refresh
                </button>
            </div>

            {error && <div className="form-error">{error}</div>}
            {loading && <p>Loading pending orders...</p>}

            {!loading && orders.length === 0 && (
                <div className="empty-state">
                    <h2>No pending orders</h2>
                    <p>Orders only appear here after a customer checks out. POS sales go directly to Sales History.</p>
                </div>
            )}

            <div className="fulfillment-grid">
                {orders.map(order => (
                    <article className="fulfillment-card" key={order.order_id}>
                        <div className="fulfillment-card-header">
                            <div>
                                <span className="status-badge status-warning">Pending</span>
                                <h2>Order #{order.order_id}</h2>
                            </div>
                            <strong>${money(order.total)}</strong>
                        </div>
                        <p>Customer #{order.customer_id} · {order.order_date}</p>

                        <div className="fulfillment-items">
                            {(order.items || []).map(item => (
                                <div key={item.order_item_id}>
                                    <span>{item.title}</span>
                                    <span>{item.quantity} × ${money(item.unit_price)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="fulfillment-actions">
                            <select
                                aria-label={`Fulfillment type for order ${order.order_id}`}
                                value={fulfillmentTypes[order.order_id] || "Shipped"}
                                onChange={event => setFulfillmentTypes(current => ({
                                    ...current,
                                    [order.order_id]: event.target.value
                                }))}
                            >
                                <option value="Shipped">Ship order</option>
                                <option value="InStore">In-store pickup</option>
                            </select>
                            <button
                                className="primary-button"
                                onClick={() => fulfillOrder(order.order_id)}
                                disabled={workingId === order.order_id}
                            >
                                {workingId === order.order_id ? "Fulfilling..." : "Fulfill Order"}
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

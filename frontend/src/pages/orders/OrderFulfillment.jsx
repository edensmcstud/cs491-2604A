import { useEffect, useState } from "react";
import api from "../../api/api";

export default function OrderFulfillment() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fulfillmentType, setFulfillmentType] = useState("Shipped");

    async function loadPendingOrders() {
        try {
            setLoading(true);
            const res = await api.get("/orders/pending");
            setOrders(res.orders || []);
        } catch (err) {
            setError("Failed to load pending orders");
        } finally {
            setLoading(false);
        }
    }

    async function fulfillOrder(order_id) {
        try {
            await api.post(`/orders/${order_id}/fulfill`, {
                fulfillment_type: fulfillmentType
            });

            await loadPendingOrders();
            alert(`Order ${order_id} fulfilled`);
        } catch (err) {
            setError("Failed to fulfill order");
        }
    }

    useEffect(() => {
        loadPendingOrders();
    }, []);

    if (loading) return <div>Loading pending orders...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h2>Pending Orders</h2>

            {orders.length === 0 && <p>No pending orders.</p>}

            {orders.map(order => (
                <div
                    key={order.order_id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <div><strong>Order ID:</strong> {order.order_id}</div>
                    <div><strong>Customer ID:</strong> {order.customer_id}</div>
                    <div><strong>Date:</strong> {order.order_date}</div>
                    <div><strong>Total:</strong> ${order.total.toFixed(2)}</div>

                    <h4 style={{ marginTop: "10px" }}>Items</h4>
                    <ul>
                        {order.items.map(item => (
                            <li key={item.order_item_id}>
                                <strong>{item.title}</strong> — {item.quantity} × ${item.unit_price.toFixed(2)}
                                <span style={{ marginLeft: "10px" }}>
                                    Line Total: ${item.line_total.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: "10px" }}>
                        <label>
                            Fulfillment Type:&nbsp;
                            <select
                                value={fulfillmentType}
                                onChange={(e) => setFulfillmentType(e.target.value)}
                            >
                                <option value="Shipped">Shipped</option>
                                <option value="InStore">In‑Store Pickup</option>
                            </select>
                        </label>

                        <button
                            onClick={() => fulfillOrder(order.order_id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Fulfill Order
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

import { useCallback, useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const money = value => Number(value || 0).toFixed(2);

export default function CustomerOrders() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [bookId, setBookId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const isCustomer = user?.roles?.includes("Customer");
    const canReadOrders = user?.modules?.customer_orders?.read === true;

    const loadOrders = useCallback(async () => {
        if (!canReadOrders) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await api.get("/customerOrders");
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load customer orders.");
        } finally {
            setLoading(false);
        }
    }, [canReadOrders]);

    useEffect(() => {
        async function loadPage() {
            try {
                const bookList = await api.get("/books");
                setBooks(Array.isArray(bookList) ? bookList : []);
            } catch (err) {
                setError(err?.response?.data?.error || "Failed to load books.");
            }
            await loadOrders();
        }

        loadPage();
    }, [loadOrders]);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (!isCustomer && !customerId) {
            setError("Please enter a customer ID.");
            return;
        }
        if (!bookId || Number(quantity) <= 0) {
            setError("Select a book and enter a quantity greater than zero.");
            return;
        }

        const orderData = {
            items: [{ book_id: Number(bookId), quantity: Number(quantity) }]
        };
        if (!isCustomer) orderData.customer_id = Number(customerId);

        try {
            const result = await api.post("/customerOrders", orderData);
            setMessage(`Order #${result.order_id} created successfully.`);
            setBookId("");
            setQuantity(1);
            await loadOrders();
        } catch (err) {
            setError(err?.response?.data?.error || err.message || "Customer order could not be created.");
        }
    }

    return (
        <div className="page customer-orders-page">
            <div className="page-heading-row">
                <div>
                    <h1>Customer Orders</h1>
                    <p className="page-subtitle">Create orders and review their current status.</p>
                </div>
                {canReadOrders && <button className="secondary-button" onClick={loadOrders}>Refresh</button>}
            </div>

            <form className="order-entry-card" onSubmit={handleSubmit}>
                {!isCustomer && (
                    <label>Customer ID
                        <input type="number" min="1" value={customerId} onChange={event => setCustomerId(event.target.value)} required />
                    </label>
                )}
                <label>Book
                    <select value={bookId} onChange={event => setBookId(event.target.value)} required>
                        <option value="">Select a book</option>
                        {books.map(book => <option key={book.book_id} value={book.book_id}>{book.title} — {book.author}</option>)}
                    </select>
                </label>
                <label>Quantity
                    <input type="number" min="1" value={quantity} onChange={event => setQuantity(event.target.value)} required />
                </label>
                <button className="primary-button" type="submit">Place Order</button>
            </form>

            {message && <div className="form-success">{message}</div>}
            {error && <div className="form-error">{error}</div>}

            {canReadOrders && <h2>Orders</h2>}
            {canReadOrders && loading && <p>Loading orders...</p>}
            {canReadOrders && !loading && orders.length === 0 && <div className="empty-state"><p>No customer orders yet.</p></div>}

            {canReadOrders && !loading && orders.length > 0 && (
                <div className="table-card">
                    <table className="data-table">
                        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Date</th><th>Status</th><th className="numeric-cell">Total</th></tr></thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id}>
                                    <td><strong>#{order.order_id}</strong></td>
                                    <td>{[order.first_name, order.last_name].filter(Boolean).join(" ") || `Customer #${order.customer_id}`}</td>
                                    <td>{(order.items || []).map(item => `${item.title || `Book #${item.book_id}`} × ${item.quantity}`).join(", ")}</td>
                                    <td>{order.order_date}</td>
                                    <td><span className={`status-badge ${order.status === "Pending" ? "status-warning" : "status-healthy"}`}>{order.status}</span></td>
                                    <td className="numeric-cell">${money(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const emptyItem = { book_id: "", quantity: 1, unit_cost: "" };

export default function SupplierOrders() {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [draftItem, setDraftItem] = useState(emptyItem);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const canCreateOrder = user?.modules?.supplier_orders?.create === true;
    const canReceiveOrder = user?.modules?.supplier_orders?.receive === true;

    const booksById = useMemo(
        () => Object.fromEntries(books.map((book) => [book.book_id, book])),
        [books]
    );

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [bookList, orderList] = await Promise.all([
                api.get("/books"),
                api.get("/supplierOrders")
            ]);

            setBooks(bookList);
            setOrders(orderList);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load supplier-order data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function selectBook(bookId) {
        const book = books.find(
            (entry) => String(entry.book_id) === String(bookId)
        );
        const retailPrice = Number.parseFloat(book?.price);
        const estimatedCost = Number.isFinite(retailPrice)
            ? (retailPrice * 0.6).toFixed(2)
            : "";

        setDraftItem((current) => ({
            ...current,
            book_id: bookId,
            unit_cost: estimatedCost
        }));
    }

    function addItem() {
        setError("");
        const quantity = Number(draftItem.quantity);
        const unitCost = Number(draftItem.unit_cost);

        if (!draftItem.book_id || !Number.isInteger(quantity) || quantity <= 0) {
            setError("Select a book and enter a whole-number quantity greater than zero.");
            return;
        }

        if (!Number.isFinite(unitCost) || unitCost <= 0) {
            setError("Unit cost must be greater than zero.");
            return;
        }

        const bookId = Number(draftItem.book_id);
        const existing = items.find((item) => item.book_id === bookId);

        if (existing) {
            setItems(items.map((item) =>
                item.book_id === bookId
                    ? { ...item, quantity: item.quantity + quantity, unit_cost: unitCost }
                    : item
            ));
        } else {
            setItems([...items, { book_id: bookId, quantity, unit_cost: unitCost }]);
        }

        setDraftItem(emptyItem);
    }

    async function createOrder(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        if (items.length === 0) {
            setError("Add at least one book to the order.");
            return;
        }

        try {
            setSaving(true);
            await api.post("/supplierOrders", {
                items
            });
            setItems([]);
            setMessage("Supplier order created successfully.");
            await loadData();
        } catch (err) {
            setError(err.response?.data?.error || "Supplier order could not be created.");
        } finally {
            setSaving(false);
        }
    }

    async function receiveOrder(orderId) {
        setMessage("");
        setError("");

        try {
            setSaving(true);
            await api.patch(`/supplierOrders/${orderId}/receive`, {});
            setMessage(`Order ${orderId} received and inventory updated.`);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.error || "Order could not be received.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="page"><h1>Supplier Orders</h1><p>Loading supplier orders...</p></div>;
    }

    return (
        <div className="page supplier-orders-page">
            <h1>Supplier Orders</h1>

            {message && <p className="status-message">{message}</p>}
            {error && <p className="error">{error}</p>}

            {canCreateOrder && (
                <section className="supplier-order-card">
                    <h2>Create Purchase Order</h2>
                    <form onSubmit={createOrder}>
                        <p>Supplier: <strong>Demo Supplier</strong></p>

                        <div className="supplier-item-entry">
                            <label>
                                Book
                                <select value={draftItem.book_id} onChange={(e) => selectBook(e.target.value)}>
                                    <option value="">Select a book</option>
                                    {books.map((book) => (
                                        <option key={book.book_id} value={book.book_id}>{book.title} — Retail ${Number(book.price).toFixed(2)}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Quantity
                                <input type="number" min="1" step="1" value={draftItem.quantity} onChange={(e) => setDraftItem({ ...draftItem, quantity: e.target.value })} />
                            </label>
                            <label>
                                Estimated Unit Cost (60% of retail)
                                <input type="number" min="0.01" step="0.01" value={draftItem.unit_cost} onChange={(e) => setDraftItem({ ...draftItem, unit_cost: e.target.value })} />
                            </label>
                            <button type="button" onClick={addItem}>Add Book</button>
                        </div>

                        {items.length > 0 && (
                            <table className="table">
                                <thead><tr><th>Book</th><th>Quantity</th><th>Unit Cost</th><th>Line Total</th><th>Action</th></tr></thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.book_id}>
                                            <td>{booksById[item.book_id]?.title || `Book ${item.book_id}`}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.unit_cost.toFixed(2)}</td>
                                            <td>${(item.quantity * item.unit_cost).toFixed(2)}</td>
                                            <td><button type="button" onClick={() => setItems(items.filter((row) => row.book_id !== item.book_id))}>Remove</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <button type="submit" disabled={saving || items.length === 0}>Create Purchase Order</button>
                    </form>
                </section>
            )}

            <section className="supplier-order-card">
                <div className="supplier-orders-heading">
                    <h2>Purchase Orders</h2>
                    <button type="button" onClick={loadData} disabled={loading}>Refresh</button>
                </div>

                {orders.length === 0 ? (
                    <p>No supplier orders have been created.</p>
                ) : (
                    <table className="table">
                        <thead><tr><th>Order</th><th>Supplier</th><th>Created</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {orders.map((order) => {
                                const total = order.items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
                                return (
                                    <tr key={order.supplier_order_id}>
                                        <td>#{order.supplier_order_id}</td>
                                        <td>{order.supplier_name}</td>
                                        <td>{new Date(`${order.created_at}Z`).toLocaleString()}</td>
                                        <td>{order.items.map((item) => `${booksById[item.book_id]?.title || `Book ${item.book_id}`} × ${item.quantity}`).join(", ")}</td>
                                        <td>${total.toFixed(2)}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            {canReceiveOrder && order.status === "Created" ? (
                                                <button type="button" disabled={saving} onClick={() => receiveOrder(order.supplier_order_id)}>Receive</button>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
import { useEffect, useState } from "react";
import api from "../../api/api";

export default function Sales() {
    const [books, setBooks] = useState([]);
    const [sales, setSales] = useState([]);
    const [form, setForm] = useState({
        isbn: "",
        quantity: 1
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/books")
            .then((res) => {
                setBooks(res);
            })
            .catch((err) => {
                console.log("Failed to load books:", err);
                setError("Failed to load book list.");
            });
    }, []);

    useEffect(() => {
        api.get("/sales")
            .then((res) => {
                setSales(res);
            })
            .catch((err) => {
                console.log("Failed to load sales:", err);
                setError("Failed to load sales.");
            });
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        const book = books.find(
            (b) => String(b.isbn) === String(form.isbn).trim()
        );

        if (!book) {
            setError("Book not found.");
            return;
        }

        const quantity = Number(form.quantity);

        if (!quantity || quantity <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        const payload = {
            items: [
                {
                    book_id: Number(book.book_id),
                    quantity
                }
            ]
        };

        setSaving(true);

        try {
            const res = await api.post("/sales", payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to record sale.");
            }

            setMessage("Sale recorded successfully.");
            setForm({
                isbn: "",
                quantity: 1
            });

            const updatedSales = await api.get("/sales");
            setSales(updatedSales);

        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to record sale."
            );
        } finally {
            setSaving(false);
        }
    }
    return (
        <div className="page">
            <h1>Sales</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <label>ISBN</label>
                <input
                    type="text"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                />

                <label>Quantity</label>
                <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Record Sale"}
                </button>
            </form>

            <h2>Recent Sales</h2>
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.flatMap((sale) =>
                        sale.items.map((item) => {
                            const book = books.find(
                                (b) => Number(b.book_id) === Number(item.book_id)
                            );

                            return (
                                <tr key={item.sale_item_id}>
                                    <td>{book?.isbn || item.book_id}</td>
                                    <td>{item.quantity}</td>
                                    <td>${Number(sale.total).toFixed(2)}</td>
                                    <td>{sale.sale_date}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

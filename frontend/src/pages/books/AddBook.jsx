import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AddBook() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({
        book_id: "",
        quantity_on_hand: 0,
        quantity_reserved: 0,
        reorder_level: 0,
        reorder_quantity: 0
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        api.get("/books")
            .then((res) => {
                setBooks(res);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Failed to load books:", err);
                setError("Failed to load book list.");
                setLoading(false);
            });
    }, []);

    function updateField(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleBookSelect(e) {
        const bookId = e.target.value;
        const book = books.find((b) => String(b.book_id) === String(bookId));

        setForm({ ...form, book_id: bookId });
        setSelectedBook(book || null);

        if (book && book.is_collectible === 1) {
            setForm({
                book_id: bookId,
                quantity_on_hand: 1,
                quantity_reserved: 0,
                reorder_level: 0,
                reorder_quantity: 0
            });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.book_id) {
            setError("You must select a book.");
            return;
        }

        const payload = {
            book_id: Number(form.book_id),
            quantity_on_hand: Number(form.quantity_on_hand),
            quantity_reserved: Number(form.quantity_reserved),
            reorder_level: Number(form.reorder_level),
            reorder_quantity: Number(form.reorder_quantity)
        };

        setSaving(true);

        try {
            const res = await api.post("/inventory", payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to create inventory item.");
            }

            navigate("/inventory");
        } catch (err) {
            setError(err.message || "Failed to create inventory item.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Add Inventory Item</h1>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Add Inventory Item</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Book</label>
                <select
                    name="book_id"
                    value={form.book_id}
                    onChange={handleBookSelect}
                >
                    <option value="">-- Select a Book --</option>
                    {books.map((b) => (
                        <option key={b.book_id} value={b.book_id}>
                            {b.title} (ID: {b.book_id})
                        </option>
                    ))}
                </select>

                <label>Quantity On Hand</label>
                <input
                    type="number"
                    name="quantity_on_hand"
                    value={form.quantity_on_hand}
                    onChange={updateField}
                    disabled={selectedBook?.is_collectible === 1}
                />

                <label>Quantity Reserved</label>
                <input
                    type="number"
                    name="quantity_reserved"
                    value={form.quantity_reserved}
                    onChange={updateField}
                    disabled={selectedBook?.is_collectible === 1}
                />

                <label>Reorder Level</label>
                <input
                    type="number"
                    name="reorder_level"
                    value={form.reorder_level}
                    onChange={updateField}
                    disabled={selectedBook?.is_collectible === 1}
                />

                <label>Reorder Quantity</label>
                <input
                    type="number"
                    name="reorder_quantity"
                    value={form.reorder_quantity}
                    onChange={updateField}
                    disabled={selectedBook?.is_collectible === 1}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Add Inventory Item"}
                </button>
            </form>
        </div>
    );
}

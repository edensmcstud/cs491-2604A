import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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

    // Load books so user can pick book_id
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
        setForm({ ...form, [e.target.name]: e.target.value });
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
                {/* Book selection */}
                <label>Book</label>
                <select
                    name="book_id"
                    value={form.book_id}
                    onChange={updateField}
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
                />

                <label>Quantity Reserved</label>
                <input
                    type="number"
                    name="quantity_reserved"
                    value={form.quantity_reserved}
                    onChange={updateField}
                />

                <label>Reorder Level</label>
                <input
                    type="number"
                    name="reorder_level"
                    value={form.reorder_level}
                    onChange={updateField}
                />

                <label>Reorder Quantity</label>
                <input
                    type="number"
                    name="reorder_quantity"
                    value={form.reorder_quantity}
                    onChange={updateField}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Add Inventory Item"}
                </button>
            </form>
        </div>
    );
}

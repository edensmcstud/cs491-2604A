import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditInventoryItem() {
    const navigate = useNavigate();
    const { id } = useParams(); // inventory_id

    const [form, setForm] = useState({
        quantity_on_hand: 0,
        quantity_reserved: 0,
        reorder_level: 0,
        reorder_quantity: 0
    });

    const [bookTitle, setBookTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const inv = await api.get(`/inventory/${id}`);

                setForm({
                    quantity_on_hand: inv.quantity_on_hand,
                    quantity_reserved: inv.quantity_reserved,
                    reorder_level: inv.reorder_level,
                    reorder_quantity: inv.reorder_quantity
                });

                const book = await api.get(`/books/${inv.book_id}`);
                setBookTitle(book.title);

                setLoading(false);
            } catch (err) {
                console.log("EditInventoryItem load error:", err);
                setError("Failed to load inventory item.");
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    function updateField(e) {
        setForm({ ...form, [e.target.name]: Number(e.target.value) });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const payload = {
            quantity_on_hand: form.quantity_on_hand,
            quantity_reserved: form.quantity_reserved,
            reorder_level: form.reorder_level,
            reorder_quantity: form.reorder_quantity
        };

        setSaving(true);

        try {
            const res = await api.put(`/inventory/${id}`, payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update inventory item.");
            }

            navigate("/inventory");
        } catch (err) {
            setError(err.message || "Failed to update inventory item.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Edit Inventory Item</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Edit Inventory Item</h1>

            <p><strong>Book:</strong> {bookTitle}</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
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
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

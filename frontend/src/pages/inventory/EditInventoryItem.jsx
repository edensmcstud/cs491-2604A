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

    const [book, setBook] = useState(null);
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

                const bookData = await api.get(`/books/${inv.book_id}`);
                setBook(bookData);

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
        const { name, value } = e.target;
        setForm({ ...form, [name]: Number(value) });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const isCollectible = book?.is_collectible === 1;

        const payload = {
            quantity_on_hand: isCollectible ? 1 : form.quantity_on_hand,
            quantity_reserved: isCollectible ? 0 : form.quantity_reserved,
            reorder_level: isCollectible ? 0 : form.reorder_level,
            reorder_quantity: isCollectible ? 0 : form.reorder_quantity
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

            {book && (
                <p>
                    <strong>Book:</strong> {book.title}{" "}
                    {book.is_collectible === 1 && "(Collectible)"}
                </p>
            )}

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {/* Centered modern form */}
            <form className="form-modern form-centered" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Quantity On Hand</label>
                    <input
                        type="number"
                        name="quantity_on_hand"
                        value={form.quantity_on_hand}
                        onChange={updateField}
                        disabled={book?.is_collectible === 1}
                        className="input-modern"
                    />
                </div>

                <div className="form-group">
                    <label>Quantity Reserved</label>
                    <input
                        type="number"
                        name="quantity_reserved"
                        value={form.quantity_reserved}
                        onChange={updateField}
                        disabled={book?.is_collectible === 1}
                        className="input-modern"
                    />
                </div>

                <div className="form-group">
                    <label>Reorder Level</label>
                    <input
                        type="number"
                        name="reorder_level"
                        value={form.reorder_level}
                        onChange={updateField}
                        disabled={book?.is_collectible === 1}
                        className="input-modern"
                    />
                </div>

                <div className="form-group">
                    <label>Reorder Quantity</label>
                    <input
                        type="number"
                        name="reorder_quantity"
                        value={form.reorder_quantity}
                        onChange={updateField}
                        disabled={book?.is_collectible === 1}
                        className="input-modern"
                    />
                </div>

                <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditBook() {
    const navigate = useNavigate();
    const { id } = useParams(); // inventory_id

    const [form, setForm] = useState({
        book_id: "",
        title: "",
        author: "",
        isbn: "",
        price: "",
        description: "",
        publisher: "",
        category: "",
        publication_year: "",
        condition: "",
        edition: "",
        binding: "",
        signed: false,
        provenance: "",
        is_collectible: false,
        quantity_on_hand: 0,
        quantity_reserved: 0,
        reorder_level: 0,
        reorder_quantity: 0
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/inventory/${id}`)
            .then((res) => {
                setForm({
                    book_id: res.book_id,
                    title: res.title || "",
                    author: res.author || "",
                    isbn: res.isbn || "",
                    price: res.price || "",
                    description: res.description || "",
                    publisher: res.publisher || "",
                    category: res.category || "",
                    publication_year: res.publication_year || "",
                    condition: res.condition || "",
                    edition: res.edition || "",
                    binding: res.binding || "",
                    signed: res.signed === 1,
                    provenance: res.provenance || "",
                    is_collectible: res.is_collectible === 1,
                    quantity_on_hand: res.quantity_on_hand,
                    quantity_reserved: res.quantity_reserved,
                    reorder_level: res.reorder_level,
                    reorder_quantity: res.reorder_quantity
                });
                setLoading(false);
            })
            .catch((err) => {
                console.log("EditBook load error:", err);
                setError("Failed to load book details.");
                setLoading(false);
            });
    }, [id]);

    function updateField(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.book_id) {
            setError("Missing book reference.");
            return;
        }

        const payload = {
            quantity_on_hand: form.is_collectible ? 1 : Number(form.quantity_on_hand),
            quantity_reserved: form.is_collectible ? 0 : Number(form.quantity_reserved),
            reorder_level: form.is_collectible ? 0 : Number(form.reorder_level),
            reorder_quantity: form.is_collectible ? 0 : Number(form.reorder_quantity)
        };

        setSaving(true);

        try {
            const res = await api.put(`/inventory/${id}`, payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update inventory.");
            }

            navigate("/inventory");
        } catch (err) {
            setError(err.message || "Failed to update inventory.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Edit Inventory</h1>
                <p>Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Edit Inventory</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <h3>Book Information</h3>

                <p><strong>Title:</strong> {form.title}</p>
                <p><strong>Author:</strong> {form.author}</p>
                <p><strong>ISBN:</strong> {form.isbn}</p>
                <p><strong>Price:</strong> ${Number(form.price).toFixed(2)}</p>

                <p><strong>Publisher:</strong> {form.publisher}</p>
                <p><strong>Category:</strong> {form.category}</p>
                <p><strong>Description:</strong> {form.description}</p>

                {form.is_collectible && (
                    <>
                        <p><strong>Condition:</strong> {form.condition}</p>
                        <p><strong>Edition:</strong> {form.edition}</p>
                        <p><strong>Binding:</strong> {form.binding}</p>
                        <p><strong>Signed:</strong> {form.signed ? "Yes" : "No"}</p>
                        <p><strong>Provenance:</strong> {form.provenance}</p>
                    </>
                )}

                <h3>Inventory Information</h3>

                <label>Quantity On Hand</label>
                <input
                    type="number"
                    name="quantity_on_hand"
                    value={form.quantity_on_hand}
                    onChange={updateField}
                    disabled={form.is_collectible}
                />

                <label>Quantity Reserved</label>
                <input
                    type="number"
                    name="quantity_reserved"
                    value={form.quantity_reserved}
                    onChange={updateField}
                    disabled={form.is_collectible}
                />

                <label>Reorder Level</label>
                <input
                    type="number"
                    name="reorder_level"
                    value={form.reorder_level}
                    onChange={updateField}
                    disabled={form.is_collectible}
                />

                <label>Reorder Quantity</label>
                <input
                    type="number"
                    name="reorder_quantity"
                    value={form.reorder_quantity}
                    onChange={updateField}
                    disabled={form.is_collectible}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

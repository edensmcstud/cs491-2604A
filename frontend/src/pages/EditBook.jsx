import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function EditBook() {
    const navigate = useNavigate();
    const { id } = useParams(); // inventory_id from route

    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        price: "",
        description: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load book details on mount
    useEffect(() => {
        api.get(`/inventory/${id}`)
            .then((res) => {
                setForm({
                    title: res.title,
                    author: res.author,
                    isbn: res.isbn,
                    price: res.price,
                    description: res.description || ""
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
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!form.title || !form.author || !form.isbn || !form.price) {
            setError("All required fields must be filled.");
            return;
        }

        if (!/^[0-9\-]{10,13}$/.test(form.isbn)) {
            setError("ISBN must be 10–13 digits.");
            return;
        }

        setSaving(true);

        try {
            const res = await api.put(`/inventory/${id}`, form);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update book.");
            }

            navigate("/inventory");
        } catch (err) {
            setError(err.message || "Failed to update book.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Edit Book</h1>
                <p>Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Edit Book</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={updateField}
                />

                <input
                    name="author"
                    placeholder="Author"
                    value={form.author}
                    onChange={updateField}
                />

                <input
                    name="isbn"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={updateField}
                />

                <input
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={updateField}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={updateField}
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

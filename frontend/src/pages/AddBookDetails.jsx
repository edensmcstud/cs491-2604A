import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AddBookDetails() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        author: "",
        isbn: "",
        price: "",
        description: ""
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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

        const payload = {
            title: form.title,
            author: form.author,
            isbn: form.isbn,
            price: Number(form.price),
            description: form.description
        };

        setSaving(true);

        try {
            const res = await api.post("/books", payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to create book.");
            }

            const newBookId = res.book_id;

            // Redirect to inventory creation with the new book preselected
            navigate(`/inventory/add?book_id=${newBookId}`);
        } catch (err) {
            setError(err.message || "Failed to create book.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page">
            <h1>Add New Book</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    placeholder="Book Title"
                />

                <label>Author</label>
                <input
                    name="author"
                    value={form.author}
                    onChange={updateField}
                    placeholder="Author Name"
                />

                <label>ISBN</label>
                <input
                    name="isbn"
                    value={form.isbn}
                    onChange={updateField}
                    placeholder="ISBN (10–13 digits)"
                />

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                    placeholder="Price"
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    placeholder="Description"
                />

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Create Book"}
                </button>
            </form>
        </div>
    );
}

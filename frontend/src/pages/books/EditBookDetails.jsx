import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";


export default function EditBookDetails() {
    const navigate = useNavigate();
    const { id } = useParams(); // book_id

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

    // Load book details
    useEffect(() => {
        api.get(`/books/${id}`)
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
                console.log("EditBookDetails load error:", err);
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
            const res = await api.put(`/books/${id}`, payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update book.");
            }

            navigate("/books"); // Change if you want a different redirect
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
                <label>Title</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                />

                <label>Author</label>
                <input
                    name="author"
                    value={form.author}
                    onChange={updateField}
                />

                <label>ISBN</label>
                <input
                    name="isbn"
                    value={form.isbn}
                    onChange={updateField}
                />

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={updateField}
                />

                <label>Description</label>
                <textarea
                    name="description"
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

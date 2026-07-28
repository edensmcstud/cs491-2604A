import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function EditBookDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
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
        is_collectible: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/books/${id}`)
            .then((res) => {
                setForm({
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
                    is_collectible: res.is_collectible === 1
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
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form.title || !form.price) {
            setError("Title and price are required.");
            return;
        }

        const payload = {
            title: form.title.trim(),
            author: form.author.trim() || null,
            isbn: form.isbn.trim() || null,
            price: Number(form.price),
            description: form.description.trim() || null,
            publisher: form.publisher.trim() || null,
            category: form.category.trim() || null,
            publication_year: form.publication_year
                ? Number(form.publication_year)
                : null,
            condition: form.is_collectible ? form.condition.trim() || null : null,
            edition: form.is_collectible ? form.edition.trim() || null : null,
            binding: form.is_collectible ? form.binding.trim() || null : null,
            signed: form.is_collectible ? (form.signed ? 1 : 0) : 0,
            provenance: form.is_collectible ? form.provenance.trim() || null : null,
            is_collectible: form.is_collectible ? 1 : 0
        };

        setSaving(true);

        try {
            const res = await api.put(`/books/${id}`, payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update book.");
            }

            navigate("/books");
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
                <label>ISBN</label>
                <input
                    name="isbn"
                    value={form.isbn}
                    onChange={updateField}
                    placeholder="ISBN (optional)"
                />

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

                <label>Publisher</label>
                <input
                    name="publisher"
                    value={form.publisher}
                    onChange={updateField}
                />

                <label>Category</label>
                <input
                    name="category"
                    value={form.category}
                    onChange={updateField}
                />

                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={updateField}
                />

                <label>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                />

                <label>
                    <input
                        type="checkbox"
                        name="is_collectible"
                        checked={form.is_collectible}
                        onChange={updateField}
                    />
                    Rare / Collectible Book
                </label>

                {form.is_collectible && (
                    <>
                        <label>Condition</label>
                        <input
                            name="condition"
                            value={form.condition}
                            onChange={updateField}
                        />

                        <label>Edition</label>
                        <input
                            name="edition"
                            value={form.edition}
                            onChange={updateField}
                        />

                        <label>Binding</label>
                        <input
                            name="binding"
                            value={form.binding}
                            onChange={updateField}
                        />

                        <label>Signed</label>
                        <input
                            type="checkbox"
                            name="signed"
                            checked={form.signed}
                            onChange={updateField}
                        />

                        <label>Provenance</label>
                        <textarea
                            name="provenance"
                            value={form.provenance}
                            onChange={updateField}
                        />
                    </>
                )}

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

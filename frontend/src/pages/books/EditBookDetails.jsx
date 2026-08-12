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

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {/* Centered modern form */}
            <form className="form-modern form-centered" onSubmit={handleSubmit}>

                {/* ISBN */}
                <div className="form-group">
                    <label>ISBN</label>
                    <input
                        name="isbn"
                        value={form.isbn}
                        onChange={updateField}
                        placeholder="ISBN (optional)"
                        className="input-modern"
                    />
                </div>

                {/* Title */}
                <div className="form-group">
                    <label>Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Author */}
                <div className="form-group">
                    <label>Author</label>
                    <input
                        name="author"
                        value={form.author}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Publisher */}
                <div className="form-group">
                    <label>Publisher</label>
                    <input
                        name="publisher"
                        value={form.publisher}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Category */}
                <div className="form-group">
                    <label>Category</label>
                    <input
                        name="category"
                        value={form.category}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Price */}
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={updateField}
                        className="input-modern"
                    />
                </div>

                {/* Collectible toggle */}
                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="is_collectible"
                            checked={form.is_collectible}
                            onChange={updateField}
                        />
                        Rare / Collectible Book
                    </label>
                </div>

                {/* Collectible fields */}
                {form.is_collectible && (
                    <>
                        <div className="form-group">
                            <label>Condition</label>
                            <input
                                name="condition"
                                value={form.condition}
                                onChange={updateField}
                                className="input-modern"
                            />
                        </div>

                        <div className="form-group">
                            <label>Edition</label>
                            <input
                                name="edition"
                                value={form.edition}
                                onChange={updateField}
                                className="input-modern"
                            />
                        </div>

                        <div className="form-group">
                            <label>Binding</label>
                            <input
                                name="binding"
                                value={form.binding}
                                onChange={updateField}
                                className="input-modern"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="signed"
                                    checked={form.signed}
                                    onChange={updateField}
                                />
                                Signed
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Provenance</label>
                            <textarea
                                name="provenance"
                                value={form.provenance}
                                onChange={updateField}
                                className="input-modern"
                            />
                        </div>
                    </>
                )}

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

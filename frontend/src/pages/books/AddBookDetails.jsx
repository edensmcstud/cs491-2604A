import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AddBookDetails() {
    const navigate = useNavigate();

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

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [lookupLoading, setLookupLoading] = useState(false);

    function updateField(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    }

    async function handleISBNLookup() {
        if (!form.isbn || form.isbn.trim().length < 10) return;

        setLookupLoading(true);
        setError("");

        try {
            const data = await api.get(`/books/lookup/${form.isbn.trim()}`);

            setForm(prev => ({
                ...prev,
                title: data.title || prev.title,
                author: data.author || prev.author,
                publisher: data.publisher || prev.publisher,
                category: data.category || prev.category,
                description: data.description || prev.description,
                publication_year: data.publication_year || prev.publication_year
            }));
        } catch (err) {
            setError("ISBN lookup failed or no metadata found.");
        } finally {
            setLookupLoading(false);
        }
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
            const res = await api.post("/books", payload);

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to create book.");
            }

            navigate("/books");
        } catch (err) {
            setError(err.message || "Failed to create book.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="page">
            <h1>Add New Book</h1>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            {/* Center the entire form */}
            <form className="form-modern form-centered" onSubmit={handleSubmit}>

                {/* ISBN */}
                <div className="form-group">
                    <label>ISBN</label>
                    <input
                        name="isbn"
                        value={form.isbn}
                        onChange={updateField}
                        onBlur={handleISBNLookup}
                        placeholder="ISBN (optional)"
                        className="input-modern"
                    />
                    {lookupLoading && (
                        <p className="text-muted">Looking up ISBN…</p>
                    )}
                </div>

                {/* Title */}
                <div className="form-group">
                    <label>Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={updateField}
                        placeholder="Book Title"
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
                        placeholder="Author Name"
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
                        placeholder="Publisher"
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
                        placeholder="Category"
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
                        placeholder="Price"
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
                        placeholder="Description"
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
                                placeholder="Condition"
                                className="input-modern"
                            />
                        </div>

                        <div className="form-group">
                            <label>Edition</label>
                            <input
                                name="edition"
                                value={form.edition}
                                onChange={updateField}
                                placeholder="Edition"
                                className="input-modern"
                            />
                        </div>

                        <div className="form-group">
                            <label>Binding</label>
                            <input
                                name="binding"
                                value={form.binding}
                                onChange={updateField}
                                placeholder="Binding"
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
                                placeholder="Provenance / History"
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
                    {saving ? "Saving…" : "Create Book"}
                </button>
            </form>
        </div>
    );
}

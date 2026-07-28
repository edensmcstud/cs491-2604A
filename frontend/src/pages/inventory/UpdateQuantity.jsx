import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function UpdateQuantity() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [currentQty, setCurrentQty] = useState(0);
    const [newQty, setNewQty] = useState(0);
    const [isCollectible, setIsCollectible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const inv = await api.get(`/inventory/${id}`);

                setCurrentQty(inv.quantity_on_hand);
                setNewQty(inv.quantity_on_hand);

                setIsCollectible(inv.is_collectible === 1);

                setLoading(false);
            } catch (err) {
                console.log("Load error:", err);
                setError("Failed to load item.");
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (isCollectible) {
            setError("Collectible books always have quantity = 1 and cannot be adjusted.");
            return;
        }

        if (newQty === "" || isNaN(newQty)) {
            setError("Quantity must be a valid number.");
            return;
        }

        if (newQty < 0) {
            setError("Quantity cannot be negative.");
            return;
        }

        const amount = newQty - currentQty;

        setSaving(true);

        try {
            const res = await api.patch(`/inventory/${id}/adjust`, {
                amount: Number(amount)
            });

            if (!res || res.error) {
                throw new Error(res?.error || "Failed to update quantity.");
            }

            navigate("/inventory");
        } catch (err) {
            setError(err.message || "Failed to update quantity.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Update Quantity</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Update Quantity</h1>

            {isCollectible && (
                <p style={{ color: "red" }}>
                    This is a collectible book. Quantity is always 1 and cannot be changed.
                </p>
            )}

            <p>Current Quantity: {currentQty}</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    placeholder="New Quantity"
                    disabled={isCollectible}
                />

                <button type="submit" disabled={saving || isCollectible}>
                    {saving ? "Saving..." : "Update Quantity"}
                </button>
            </form>
        </div>
    );
}

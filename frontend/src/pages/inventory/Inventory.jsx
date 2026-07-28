import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function Inventory() {
    const { user } = useAuth();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const canEditInventory =
        user.roles.includes("Admin") || user.roles.includes("Employee");

    const canEditBook = user.modules?.books?.update === true;

    useEffect(() => {
        api.get("/inventory")
            .then((res) => {
                setItems(res);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Inventory load error:", err);
                setError("Failed to load inventory");
                setLoading(false);
            });
    }, []);

    return (
        <div className="page">
            <h1>Inventory</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Collectible</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr key={item.inventory_id}>
                                <td>{item.isbn}</td>
                                <td>{item.title}</td>
                                <td>{item.is_collectible === 1 ? "Yes" : "No"}</td>
                                <td>{item.quantity_on_hand}</td>

                                <td>
                                    {item.quantity_on_hand > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </td>

                                <td>
                                    {canEditBook && (
                                        <Link to={`/books/edit/${item.book_id}`}>
                                            <button>Edit Book</button>
                                        </Link>
                                    )}

                                    {canEditInventory && (
                                        <Link to={`/inventory/edit/${item.inventory_id}`}>
                                            <button style={{ marginLeft: "10px" }}>
                                                Edit Inventory
                                            </button>
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function Inventory() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            {/* REMOVE: Add Inventory Item button */}
            {/* Inventory is auto-created when books are created */}

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
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
                                <td>{item.quantity_on_hand}</td>
                                <td>
                                    {item.quantity_on_hand > 0
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </td>

                                <td>
                                    {/* ADMIN ONLY: Edit */}
                                    {user.roles.includes("Admin") && (
                                        <Link to={`/inventory/edit/${item.inventory_id}`}>
                                            <button>Edit</button>
                                        </Link>
                                    )}

                                    {/* ADMIN + EMPLOYEE: Update Qty */}
                                    {(user.roles.includes("Admin") ||
                                        user.roles.includes("Employee")) && (
                                            <Link to={`/inventory/update/${item.inventory_id}`}>
                                                <button>Update Qty</button>
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

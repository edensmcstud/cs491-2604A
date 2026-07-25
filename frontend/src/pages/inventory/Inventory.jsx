import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";


export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("Inventory mounted");

        api.get("/inventory")
            .then((res) => {
                console.log("Inventory response:", res);
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

            {/* Add Book */}
            <Link to="/inventory/add">
                <button>Add Book</button>
            </Link>

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
                                    {/* Edit Book */}
                                    <Link to={`/inventory/edit/${item.inventory_id}`}>
                                        <button>Edit</button>
                                    </Link>

                                    {/* Update Quantity */}
                                    <Link to={`/inventory/update/${item.inventory_id}`}>
                                        <button>Update Qty</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

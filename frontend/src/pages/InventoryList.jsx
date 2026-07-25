import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function InventoryList() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [books, setBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                // Load inventory
                const inv = await api.get("/inventory");

                // Load books for title lookup
                const bookList = await api.get("/books");

                // Convert books array → lookup map
                const bookMap = {};
                bookList.forEach((b) => {
                    bookMap[b.book_id] = b.title;
                });

                setInventory(inv);
                setBooks(bookMap);
                setLoading(false);
            } catch (err) {
                console.log("InventoryList load error:", err);
                setError("Failed to load inventory.");
                setLoading(false);
            }
        }

        loadData();
    }, []);

    async function deleteItem(id) {
        if (!window.confirm("Delete this inventory item?")) return;

        try {
            await api.delete(`/inventory/${id}`);
            setInventory(inventory.filter((i) => i.inventory_id !== id));
        } catch (err) {
            console.log("Delete error:", err);
            alert("Failed to delete inventory item.");
        }
    }

    if (loading) {
        return (
            <div className="page">
                <h1>Inventory</h1>
                <p>Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Inventory</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
                onClick={() => navigate("/inventory/add")}
                style={{ marginBottom: "20px" }}
            >
                Add Inventory Item
            </button>

            <table className="table">
                <thead>
                    <tr>
                        <th>Inventory ID</th>
                        <th>Book</th>
                        <th>Quantity On Hand</th>
                        <th>Reserved</th>
                        <th>Reorder Level</th>
                        <th>Reorder Quantity</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {inventory.map((item) => (
                        <tr key={item.inventory_id}>
                            <td>{item.inventory_id}</td>

                            <td>
                                {books[item.book_id] || `Book ID ${item.book_id}`}
                            </td>

                            <td>{item.quantity_on_hand}</td>
                            <td>{item.quantity_reserved}</td>
                            <td>{item.reorder_level}</td>
                            <td>{item.reorder_quantity}</td>
                            <td>{item.last_updated}</td>

                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/inventory/edit/${item.inventory_id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(`/inventory/update/${item.inventory_id}`)
                                    }
                                    style={{ marginLeft: "10px" }}
                                >
                                    Update Qty
                                </button>

                                <button
                                    onClick={() => deleteItem(item.inventory_id)}
                                    style={{ marginLeft: "10px", color: "red" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

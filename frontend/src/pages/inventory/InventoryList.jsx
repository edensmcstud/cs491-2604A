import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function InventoryList() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [books, setBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const inv = await api.get("/inventory");
                const bookList = await api.get("/books");

                const bookMap = {};
                bookList.forEach((b) => {
                    bookMap[b.book_id] = {
                        title: b.title,
                        isbn: b.isbn,
                        is_collectible: b.is_collectible
                    };
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

            <table className="table">
                <thead>
                    <tr>
                        <th>Inventory ID</th>
                        <th>Book</th>
                        <th>ISBN</th>
                        <th>Collectible</th>
                        <th>Quantity On Hand</th>
                        <th>Reserved</th>
                        <th>Reorder Level</th>
                        <th>Reorder Quantity</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {inventory.map((item) => {
                        const book = books[item.book_id] || {};

                        return (
                            <tr key={item.inventory_id}>
                                <td>{item.inventory_id}</td>

                                <td>{book.title || `Book ID ${item.book_id}`}</td>
                                <td>{book.isbn || "—"}</td>
                                <td>{book.is_collectible === 1 ? "Yes" : "No"}</td>

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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

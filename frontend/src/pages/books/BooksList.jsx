import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function BooksList() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const canCreate = user?.modules?.books?.create === true;
    const canUpdate = user?.modules?.books?.update === true;
    const canAddInventory = user?.modules?.inventory?.adjust === true;

    useEffect(() => {
        api.get("/books")
            .then((res) => {
                setBooks(res);
                setLoading(false);
            })
            .catch((err) => {
                console.log("BooksList load error:", err);
                setError("Failed to load books.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="page">
                <h1>Books</h1>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Books</h1>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {canCreate && (
                <button
                    onClick={() => navigate("/books/add")}
                    style={{ marginBottom: "20px" }}
                >
                    Add New Book
                </button>
            )}

            <table className="table">
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Publisher</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Collectible</th>
                        <th>Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((b) => (
                        <tr key={b.book_id}>
                            <td>{b.book_id}</td>
                            <td>{b.title}</td>
                            <td>{b.author}</td>
                            <td>{b.isbn}</td>
                            <td>{b.publisher}</td>
                            <td>{b.category}</td>
                            <td>${Number(b.price).toFixed(2)}</td>
                            <td>{b.is_collectible ? "Yes" : "No"}</td>

                            <td>
                                {canAddInventory
                                    ? b.quantity_on_hand
                                    : b.available_quantity}
                            </td>

                            <td>
                                {canUpdate && (
                                    <button
                                        onClick={() =>
                                            navigate(`/books/edit/${b.book_id}`)
                                        }
                                    >
                                        Edit
                                    </button>
                                )}

                                {canAddInventory && b.inventory_id && (
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/inventory/edit/${b.inventory_id}`
                                            )
                                        }
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Edit Inventory
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

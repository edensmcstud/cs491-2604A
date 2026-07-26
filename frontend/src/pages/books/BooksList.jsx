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

    // Permission checks
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

            {/* Only show Add New Book if user has create permission */}
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
                        <th>Price</th>
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
                            <td>${b.price}</td>

                            <td>
                                {/* Edit only if user has update permission */}
                                {canUpdate && (
                                    <button
                                        onClick={() =>
                                            navigate(`/books/edit/${b.book_id}`)
                                        }
                                    >
                                        Edit
                                    </button>
                                )}

                                {/* Add Inventory only if user has inventory.adjust */}
                                {canAddInventory && (
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/inventory/update/${b.inventory_id}`
                                            )
                                        }
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Update Inventory
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

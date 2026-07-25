import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";


export default function BooksList() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/books")
            .then((res) => {
                //console.log("Books API response:", res.data);

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

            <button
                onClick={() => navigate("/books/add")}
                style={{ marginBottom: "20px" }}
            >
                Add New Book
            </button>

            <table className="table">
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Price</th>
                        <th>Description</th>
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
                            <td>{b.description}</td>

                            <td>
                                <button
                                    onClick={() =>
                                        navigate(`/books/edit/${b.book_id}`)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/inventory/add?book_id=${b.book_id}`
                                        )
                                    }
                                    style={{ marginLeft: "10px" }}
                                >
                                    Add Inventory
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

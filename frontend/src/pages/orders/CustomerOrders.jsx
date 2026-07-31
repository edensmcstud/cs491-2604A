import { useEffect, useState } from "react";
import api from "../../api/api";

export default function CustomerOrders() {
    const [books, setBooks] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [bookId, setBookId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBooks() {
            try {
                const bookList = await api.get("/books");
                setBooks(bookList);
            } catch (err) {
                console.error("Book loading error:", err);
                setError("Failed to load books.");
            }
        }

        loadBooks();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!customerId) {
            setError("Please enter a customer ID.");
            return;
        }

        if (!bookId) {
            setError("Please select a book.");
            return;
        }

        if (Number(quantity) <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        try {
            await api.post("/customerOrders", {
                customer_id: Number(customerId),
                items: [
                    {
                        book_id: Number(bookId),
                        quantity: Number(quantity)
                    }
                ]
            });

            setMessage("Customer order created successfully.");
            setBookId("");
            setQuantity(1);
        } catch (err) {
            console.error("Customer order error:", err);

            setError(
                err.response?.data?.error ||
                err.message ||
                "Customer order could not be created."
            );
        }
    }

    return (
        <div className="page">
            <h1>Customer Orders</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="customerId">Customer ID</label>

                    <input
                        id="customerId"
                        type="number"
                        min="1"
                        value={customerId}
                        onChange={(event) =>
                            setCustomerId(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="bookId">Book</label>

                    <select
                        id="bookId"
                        value={bookId}
                        onChange={(event) =>
                            setBookId(event.target.value)
                        }
                    >
                        <option value="">Select a book</option>

                        {books.map((book) => (
                            <option
                                key={book.book_id}
                                value={book.book_id}
                            >
                                {book.title} — {book.author}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity">Quantity</label>

                    <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) =>
                            setQuantity(event.target.value)
                        }
                    />
                </div>

                <button type="submit">
                    Create Order
                </button>
            </form>

            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            <h2>Orders</h2>

            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Book</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Existing orders will be loaded here later. */}
                </tbody>
            </table>
        </div>
    );
}

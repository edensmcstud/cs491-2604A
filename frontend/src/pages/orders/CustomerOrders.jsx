import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export default function CustomerOrders() {
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [bookId, setBookId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const isCustomer = user?.roles?.includes("Customer");

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

        // Staff members must identify the customer for whom
        // they are creating the order.
        if (!isCustomer && !customerId) {
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

        const orderData = {
            items: [
                {
                    book_id: Number(bookId),
                    quantity: Number(quantity)
                }
            ]
        };

        // Customers do not send a customer ID. The backend finds
        // their customer profile from the logged-in user account.
        if (!isCustomer) {
            orderData.customer_id = Number(customerId);
        }

        try {
            await api.post("/customerOrders", orderData);

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

            {isCustomer && (
                <p>
                    Place an order for your account. Your customer information
                    will be added automatically.
                </p>
            )}

            <form onSubmit={handleSubmit}>
                {!isCustomer && (
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
                            required
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="bookId">Book</label>

                    <select
                        id="bookId"
                        value={bookId}
                        onChange={(event) =>
                            setBookId(event.target.value)
                        }
                        required
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
                        required
                    />
                </div>

                <button type="submit">
                    Place Order
                </button>
            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

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

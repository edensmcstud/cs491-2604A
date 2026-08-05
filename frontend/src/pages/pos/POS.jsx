import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function POS() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [items, setItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    const navigate = useNavigate();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    async function handleSearch() {
        const data = await api.get(`/books/search?q=${search}`);
        setResults(data);
    }

    function addItem(book) {
        setItems(prev => {
            const existing = prev.find(i => i.book_id === book.book_id);
            if (existing) {
                return prev.map(i =>
                    i.book_id === book.book_id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...book, quantity: 1 }];
        });
    }

    function updateQuantity(book_id, qty) {
        setItems(prev =>
            prev.map(i =>
                i.book_id === book_id ? { ...i, quantity: qty } : i
            )
        );
    }

    async function completeSale() {
        try {
            const response = await api.post("/sales/pos", {
                items,
                payment_method: paymentMethod   // FIXED
            });

            const { sale_id } = response;
            navigate(`/sales/${sale_id}/receipt`);
        } catch (err) {
            console.error("POS ERROR:", err);

            const message =
                err?.response?.data?.error ||
                "Failed to complete sale";

            alert(message);
        }
    }
 return (
        <div className="page">
            <h1>Point of Sale</h1>

            {/* Search */}
            <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search books..."
            />
            <button onClick={handleSearch}>Search</button>

            {/* Search Results */}
            <ul>
                {results.map(book => (
                    <li key={book.book_id}>
                        {book.title} — ${book.price}
                        <button onClick={() => addItem(book)}>Add</button>
                    </li>
                ))}
            </ul>

            {/* Items */}
            <h2>Sale Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item.book_id}>
                        {item.title} — ${item.price}
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateQuantity(item.book_id, Number(e.target.value))}
                        />
                    </li>
                ))}
            </ul>

            {/* Totals */}
            <h2>Totals</h2>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>

            {/* Payment */}
            <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
            >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
            </select>

            {/* Complete Sale */}
            <button onClick={completeSale}>Complete Sale</button>
        </div>
    );
}

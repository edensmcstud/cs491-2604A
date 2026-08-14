import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
    const { user } = useAuth();

    const {
        items,
        total,
        count,
        loadCart,
        removeFromCart,
        decrement,
        clearCart,
        checkout
    } = useCart();

    useEffect(() => {
        loadCart();
    }, []);

    if (!user) {
        return (
            <div className="page">
                <h1>Cart</h1>
                <p>You must be logged in to view your cart.</p>
            </div>
        );
    }

    if (!items) {
        return (
            <div className="page">
                <h1>Cart</h1>
                <p>Loading cart...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Your Cart</h1>

            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {items.map(item => (
                        <div
                            key={item.book_id}
                            style={{
                                borderBottom: "1px solid #ccc",
                                padding: "10px 0"
                            }}
                        >
                            <strong>{item.title}</strong>
                            <div>Quantity: {item.quantity}</div>
                            <div>Subtotal: ${Number(item.subtotal || 0).toFixed(2)}</div>

                            <div style={{ marginTop: "10px" }}>
                                <button
                                    onClick={() => decrement(item.book_id)}
                                    style={{ marginRight: "10px" }}
                                >
                                    Remove One
                                </button>

                                <button
                                    onClick={() => removeFromCart(item.book_id)}
                                >
                                    Remove All
                                </button>
                            </div>
                        </div>
                    ))}

                    <h2>Total: ${total.toFixed(2)}</h2>

                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={clearCart}
                            style={{ marginRight: "10px" }}
                        >
                            Clear Cart
                        </button>

                        <button onClick={checkout}>
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

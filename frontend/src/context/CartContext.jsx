import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);

    async function loadCart() {
        const token = localStorage.getItem("token");
        if (!token) {
            setItems([]);
            setTotal(0);
            setCount(0);
            return;
        }

        try {
            const res = await api.get("/cart");

            const updatedItems = res.items || [];
            const updatedTotal = res.total || 0;

            const qtyCount = updatedItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setItems(updatedItems);
            setTotal(updatedTotal);
            setCount(qtyCount);

        } catch (err) {
            console.log("CartContext loadCart ERROR:", err);
            setItems([]);
            setTotal(0);
            setCount(0);
        }
    }

    useEffect(() => {
        loadCart();
    }, []);

    async function addToCart(book_id) {
        try {
            await api.post("/cart/add", { book_id, quantity: 1 });
            await loadCart();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err?.response?.data?.error || "Failed to add item to cart."
            };
        }
    }

    async function removeFromCart(book_id) {
        try {
            await api.delete(`/cart/remove/${book_id}`);
            await loadCart();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err?.response?.data?.error || "Failed to remove item from cart."
            };
        }
    }

    async function decrement(book_id) {
        try {
            await api.delete(`/cart/decrement/${book_id}`);
            await loadCart();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err?.response?.data?.error || "Failed to update item quantity."
            };
        }
    }

    async function clearCart() {
        try {
            await api.delete("/cart");
            await loadCart();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err?.response?.data?.error || "Failed to clear cart."
            };
        }
    }

    async function checkout() {
        try {
            await api.post("/cart/checkout", {
                payment_method: "N/A",
                shipping_address: "N/A"
            });
            await loadCart();
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err?.response?.data?.error || "Checkout failed."
            };
        }
    }

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                count,
                loadCart,
                addToCart,
                removeFromCart,
                decrement,
                clearCart,
                checkout
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

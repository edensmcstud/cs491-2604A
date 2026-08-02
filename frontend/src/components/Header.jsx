import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { count } = useCart();
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <h1>Bookstore Management System</h1>

            <nav className="header-nav">

                {/* Cart only visible for Customer role */}
                {user?.roles?.includes("Customer") && (
                    <Link to="/cart">
                        Cart ({count})
                    </Link>
                )}

                {/* Logout always visible when logged in */}
                {user && (
                    <button
                        onClick={logout}
                        className="logout-button"
                        style={{ marginLeft: "1rem" }}
                    >
                        Logout
                    </button>
                )}

            </nav>
        </header>
    );
}

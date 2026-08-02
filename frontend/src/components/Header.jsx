import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { count } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="header">
            <Link to="/dashboard" className="header-dashboard">Dashboard</Link>

            <nav className="header-nav">

                {/* Cart visible for anyone with cart permission */}
                {user?.modules?.cart?.use === true && (
                    <Link to="/cart">
                        Cart ({count})
                    </Link>
                )}

                {/* Logout always visible when logged in */}
                {user && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>
                )}

            </nav>
        </header>
    );
}

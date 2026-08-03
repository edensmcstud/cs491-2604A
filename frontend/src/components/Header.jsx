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

    // Normalize role
    const isCustomer =
        Array.isArray(user?.roles) &&
        user.roles[0]?.toLowerCase() === "customer";

    return (
        <header className="header">
            <Link to="/dashboard" className="header-dashboard">Dashboard</Link>

            <nav className="header-nav">

                {/* Cart visible only for customers with cart permission */}
                {isCustomer && user?.modules?.cart?.use === true && (
                    <Link to="/cart">
                        Cart ({count})
                    </Link>
                )}

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

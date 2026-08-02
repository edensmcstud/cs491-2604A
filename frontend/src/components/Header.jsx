import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";

export default function Header() {
    const { count, loadCart } = useCart();


    console.log("Header rendered → count =", count);
    return (
        <header className="header">
            <h1>Bookstore Management System</h1>
            
            <nav className="header-nav">
                <Link to="/cart">
                    Cart ({count})
                    

                </Link>
            </nav>
        </header>
    );
}

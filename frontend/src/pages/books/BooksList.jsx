import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

import FiltersPanel from "../../components/BooksList/FiltersPanel";
import BooksTable from "../../components/BooksTable/BooksTable";

export default function BooksList() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const canCreate = user?.modules?.books?.create === true;
    const canUpdate = user?.modules?.books?.update === true;
    const canAddInventory = user?.modules?.inventory?.adjust === true;

    // FILTER STATE
    const [inStock, setInStock] = useState(false);
    const [rareOnly, setRareOnly] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [priceLimit, setPriceLimit] = useState(500);

    const canUseCart = user?.modules?.cart?.use === true;


    // COLUMN VISIBILITY STATE
    const [visibleColumns, setVisibleColumns] = useState({
        bookId: true,
        title: true,
        author: true,
        isbn: true,
        publisher: true,
        category: true,
        price: true,
        collectible: true,
        available: true,
        actions: true
    });

    // LOAD BOOKS
    useEffect(() => {
        api.get("/books")
            .then((res) => {
                setBooks(res);

                const highest = Math.max(...res.map(b => b.price));
                setPriceLimit(highest || 500);
                setMaxPrice(highest || 500);

                setLoading(false);
            })
            .catch((err) => {
                console.log("BooksList load error:", err);
                setError("Failed to load books.");
                setLoading(false);
            });
    }, []);

    // APPLY FILTERS
    const filteredBooks = useMemo(() => {
        return books
            .filter(b => !inStock || b.quantity_on_hand > 0)
            .filter(b => !rareOnly || b.is_collectible === 1)
            .filter(b => b.price >= minPrice && b.price <= maxPrice);
    }, [books, inStock, rareOnly, minPrice, maxPrice]);

    if (loading) {
        return (
            <div className="page">
                <h1>Books</h1>
                <p>Loading books...</p>
            </div>
        );
    }

    return (
        <div className="page books-layout">
            {/* SIDEBAR FILTERS */}
            <FiltersPanel
                inStock={inStock}
                rareOnly={rareOnly}
                setInStock={setInStock}
                setRareOnly={setRareOnly}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceLimit={priceLimit}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
            />

            {/* MAIN CONTENT */}
            <main className="books-main">
                <h1>Books</h1>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {canCreate && (
                    <button
                        onClick={() => navigate("/books/add")}
                        style={{ marginBottom: "20px" }}
                    >
                        Add New Book
                    </button>
                )}

                <BooksTable
                    books={filteredBooks}
                    visibleColumns={visibleColumns}
                    canUpdate={canUpdate}
                    canAddInventory={canAddInventory}
                    canUseCart={canUseCart}
                    onEditBook={(id) => navigate(`/books/edit/${id}`)}
                    onEditInventory={(inventoryId) =>
                        navigate(`/inventory/edit/${inventoryId}`)
                    }
                />

            </main>
        </div>
    );
}

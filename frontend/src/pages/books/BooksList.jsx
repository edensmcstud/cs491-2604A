import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import FiltersPanel from "../../components/BooksList/FiltersPanel";
import BooksTable from "../../components/BooksTable/BooksTable";

export default function BooksList() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // BACKEND SEARCH TERM
    const [search, setSearch] = useState("");

    // BOOK DATA
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // CLIENT FILTERS
    const [inStock, setInStock] = useState(false);
    const [rareOnly, setRareOnly] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [priceLimit, setPriceLimit] = useState(500);

    // COLUMN VISIBILITY
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

    // PERMISSIONS
    const canCreate = user?.modules?.books?.create === true;
    const canUpdate = user?.modules?.books?.update === true;
    const canAddInventory = user?.modules?.inventory?.adjust === true;
    const canUseCart = user?.modules?.cart?.use === true;

    // INITIAL LOAD — FULL CATALOG
    useEffect(() => {
        api.get("/books/withInventory")
            .then((result) => {
                setBooks(result);

                const highest = Math.max(0, ...result.map(b => Number(b.price) || 0));
                const limit = Math.ceil(highest) || 500;

                setPriceLimit(limit);
                setMaxPrice(limit);
            })
            .catch((err) => {
                console.error("BooksList load error:", err);
                setError("Failed to load books.");
            })
            .finally(() => setLoading(false));
    }, []);

    // BACKEND SEARCH — POS STYLE
    async function handleSearch() {
        try {
            // If search box is empty → reload full catalog
            if (!search.trim()) {
                const full = await api.get("/books/withInventory");
                setBooks(full);
                return;
            }

            // Otherwise perform backend search
            const data = await api.get(`/books/search?q=${search}`);
            setBooks(data);

        } catch (err) {
            console.error("Search error:", err);
            setError("Search failed.");
        }
    }


    // CLIENT FILTERS APPLIED TO BACKEND RESULTS
    const filteredBooks = useMemo(() => {
        return books
            .filter(b => !inStock || Number(b.quantity_on_hand) > 0)
            .filter(b => !rareOnly || Number(b.is_collectible) === 1)
            .filter(b => Number(b.price) >= minPrice && Number(b.price) <= maxPrice);
    }, [books, inStock, rareOnly, minPrice, maxPrice]);

    if (loading) {
        return (
            <div className="page books-loading">
                <h1>Books</h1>
                <p>Loading catalog...</p>
            </div>
        );
    }

    return (
        <div className="page books-layout">

            {/* SIDEBAR FILTERS (INCLUDING SEARCH) */}
            <FiltersPanel
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch}

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
                <div className="books-page-heading">
                    <div>
                        <h1>Books</h1>
                        <p>{filteredBooks.length} of {books.length} books shown</p>
                    </div>

                    {canCreate && (
                        <button
                            className="primary-button"
                            onClick={() => navigate("/books/add")}
                        >
                            Add New Book
                        </button>
                    )}
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <BooksTable
                    books={filteredBooks}
                    visibleColumns={visibleColumns}
                    canUpdate={canUpdate}
                    canAddInventory={canAddInventory}
                    canUseCart={canUseCart}
                    onEditBook={(id) => navigate(`/books/edit/${id}`)}
                    onEditInventory={(inventoryId) => navigate(`/inventory/edit/${inventoryId}`)}
                />
            </main>
        </div>
    );
}

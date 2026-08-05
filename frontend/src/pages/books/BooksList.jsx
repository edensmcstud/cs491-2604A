import { useEffect, useMemo, useState } from "react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [inStock, setInStock] = useState(false);
    const [rareOnly, setRareOnly] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [priceLimit, setPriceLimit] = useState(500);
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

    const canCreate = user?.modules?.books?.create === true;
    const canUpdate = user?.modules?.books?.update === true;
    const canAddInventory = user?.modules?.inventory?.adjust === true;
    const canUseCart = user?.modules?.cart?.use === true;

    useEffect(() => {
        api.get("/books/withInventory")
            .then((result) => {
                setBooks(result);
                const highest = Math.max(0, ...result.map((book) => Number(book.price) || 0));
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

    const filteredBooks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return books
            .filter((book) => {
                if (!search) {
                    return true;
                }

                const title = book.title?.toLowerCase() || "";
                const author = book.author?.toLowerCase() || "";
                const isbn = String(book.isbn || "").toLowerCase();

                return (
                    title.includes(search) ||
                    author.includes(search) ||
                    isbn.includes(search)
                );
            })
            .filter(b => !inStock || b.quantity_on_hand > 0)
            .filter(b => !rareOnly || b.is_collectible === 1)
            .filter(b => b.price >= minPrice && b.price <= maxPrice);
    }, [books, searchTerm, inStock, rareOnly, minPrice, maxPrice]);

    if (loading) {
        return <div className="page books-loading"><h1>Books</h1><p>Loading catalog...</p></div>;
    }

    return (
        <div className="page books-layout">
            {/* SIDEBAR FILTERS */}
            <FiltersPanel
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
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
                    <button className="primary-button" onClick={() => navigate("/books/add")}>Add New Book</button>
                )}
            </div>

            <div className="books-search-row">
                <label htmlFor="book-search">Search catalog</label>
                <input
                    id="book-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, author, ISBN, publisher, or category"
                />
            </div>

            {error && <p className="error">{error}</p>}

            <div className="books-layout">
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

                <main className="books-main">
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
        </div>
    );
}
import PriceSlider from "./PriceSlider";

export default function FiltersPanel({
    search,
    setSearch,
    handleSearch,

    inStock,
    rareOnly,
    setInStock,
    setRareOnly,

    minPrice,
    maxPrice,
    priceLimit,
    setMinPrice,
    setMaxPrice,

    visibleColumns,
    setVisibleColumns
}) {
    const handleColumnToggle = (key) => {
        setVisibleColumns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <aside className="filters">
            <h3>Filters</h3>

            {/* SEARCH (Backend-driven, POS-style + Enter key support) */}
            <div className="filter-group">
                <label htmlFor="book-search">Search Books</label>

                <input
                    id="book-search"
                    type="text"
                    placeholder="Title, author, ISBN, publisher, category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch();
                        }
                    }}
                    style={{
                        width: "100%",
                        marginTop: "5px",
                        marginBottom: "8px"
                    }}
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    style={{ marginBottom: "12px" }}
                >
                    Search
                </button>

                {search && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            handleSearch(); // reload full catalog
                        }}
                        style={{ marginBottom: "12px" }}
                    >
                        Clear Search
                    </button>
                )}
            </div>

            {/* STOCK + COLLECTIBLE FILTERS */}
            <div className="filter-group">
                <label>
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                    />
                    In Stock Only
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={rareOnly}
                        onChange={(e) => setRareOnly(e.target.checked)}
                    />
                    Rare / Collectible Only
                </label>
            </div>

            {/* PRICE SLIDER */}
            <PriceSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceLimit={priceLimit}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
            />

            {/* COLUMN VISIBILITY */}
            <div className="filter-group" style={{ marginTop: "20px" }}>
                <h4>Columns</h4>

                {Object.entries(visibleColumns).map(([key, value]) => (
                    <label key={key} style={{ display: "block" }}>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={() => handleColumnToggle(key)}
                        />
                        {columnLabel(key)}
                    </label>
                ))}
            </div>
        </aside>
    );
}

function columnLabel(key) {
    switch (key) {
        case "bookId": return "Book ID";
        case "title": return "Title";
        case "author": return "Author";
        case "isbn": return "ISBN";
        case "publisher": return "Publisher";
        case "category": return "Category";
        case "price": return "Price";
        case "collectible": return "Collectible";
        case "available": return "Available";
        case "actions": return "Actions";
        default: return key;
    }
}

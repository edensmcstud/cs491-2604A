import PriceSlider from "./PriceSlider";

export default function FiltersPanel({
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

            <PriceSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceLimit={priceLimit}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
            />

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

export default function ColumnVisibility({ visibleColumns, setVisibleColumns }) {
    const toggle = (key) => {
        setVisibleColumns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="column-visibility">
            {Object.entries(visibleColumns).map(([key, value]) => (
                <label key={key} style={{ display: "block", marginBottom: "4px" }}>
                    <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggle(key)}
                    />
                    {labelFor(key)}
                </label>
            ))}
        </div>
    );
}

function labelFor(key) {
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

import { useState, useMemo } from "react";
import SortHeader from "./SortHeader";

export default function BooksTable({
    books,
    visibleColumns,
    canUpdate,
    canAddInventory,
    onEditBook,
    onEditInventory
}) {
    const [sortColumn, setSortColumn] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");

    const sortedBooks = useMemo(() => {
        const sorted = [...books];
        sorted.sort((a, b) => compare(a, b, sortColumn, sortDirection));
        return sorted;
    }, [books, sortColumn, sortDirection]);

    const handleSort = (columnKey) => {
        setSortColumn(prev => {
            if (prev === columnKey) {
                setSortDirection(d => (d === "asc" ? "desc" : "asc"));
                return prev;
            }
            setSortDirection("asc");
            return columnKey;
        });
    };

    return (
        <div className="books-grid">
            <div className="books-grid-header">
                {visibleColumns.bookId && (
                    <SortHeader
                        label="Book ID"
                        columnKey="book_id"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.title && (
                    <SortHeader
                        label="Title"
                        columnKey="title"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.author && (
                    <SortHeader
                        label="Author"
                        columnKey="author"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.isbn && (
                    <SortHeader
                        label="ISBN"
                        columnKey="isbn"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.publisher && (
                    <SortHeader
                        label="Publisher"
                        columnKey="publisher"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.category && (
                    <SortHeader
                        label="Category"
                        columnKey="category"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.price && (
                    <SortHeader
                        label="Price"
                        columnKey="price"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.collectible && <div className="books-grid-header-cell">Collectible</div>}
                {visibleColumns.available && (
                    <SortHeader
                        label="Available"
                        columnKey="available_quantity"
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                    />
                )}
                {visibleColumns.actions && <div className="books-grid-header-cell">Actions</div>}
            </div>

            <div className="books-grid-body">
                {sortedBooks.map((b) => (
                    <div className="books-grid-row" key={b.book_id}>
                        {visibleColumns.bookId && (
                            <div className="books-grid-cell">{b.book_id}</div>
                        )}
                        {visibleColumns.title && (
                            <div className="books-grid-cell">{b.title}</div>
                        )}
                        {visibleColumns.author && (
                            <div className="books-grid-cell">{b.author}</div>
                        )}
                        {visibleColumns.isbn && (
                            <div className="books-grid-cell">{b.isbn}</div>
                        )}
                        {visibleColumns.publisher && (
                            <div className="books-grid-cell">{b.publisher}</div>
                        )}
                        {visibleColumns.category && (
                            <div className="books-grid-cell">{b.category}</div>
                        )}
                        {visibleColumns.price && (
                            <div className="books-grid-cell">
                                ${Number(b.price).toFixed(2)}
                            </div>
                        )}
                        {visibleColumns.collectible && (
                            <div className="books-grid-cell">
                                {b.is_collectible ? "Yes" : "No"}
                            </div>
                        )}
                        {visibleColumns.available && (
                            <div className="books-grid-cell">
                                {canAddInventory
                                    ? b.quantity_on_hand
                                    : b.available_quantity}
                            </div>
                        )}
                        {visibleColumns.actions && (
                            <div className="books-grid-cell">
                                {canUpdate && (
                                    <button onClick={() => onEditBook(b.book_id)}>
                                        Edit
                                    </button>
                                )}

                                {canAddInventory && b.inventory_id && (
                                    <button
                                        onClick={() =>
                                            onEditInventory(b.inventory_id)
                                        }
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Edit Inventory
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function compare(a, b, column, direction) {
    const dir = direction === "asc" ? 1 : -1;

    const getVal = (obj) => {
        switch (column) {
            case "book_id": return obj.book_id;
            case "title": return obj.title || "";
            case "author": return obj.author || "";
            case "isbn": return obj.isbn || "";
            case "publisher": return obj.publisher || "";
            case "category": return obj.category || "";
            case "price": return Number(obj.price) || 0;
            case "available_quantity": return Number(obj.available_quantity ?? obj.quantity_on_hand) || 0;
            default: return "";
        }
    };

    const va = getVal(a);
    const vb = getVal(b);

    if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
    }

    return String(va).localeCompare(String(vb)) * dir;
}

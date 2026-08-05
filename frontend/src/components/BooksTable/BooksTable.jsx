import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import SortHeader from "./SortHeader";

export default function BooksTable({
    books,
    visibleColumns,
    canUseCart,
    canUpdate,
    canAddInventory,
    onEditBook,
    onEditInventory,
    onSelectBook
}) {
    const { addToCart } = useCart();
    const [sortColumn, setSortColumn] = useState("title");
    const [sortDirection, setSortDirection] = useState("asc");

    const sortedBooks = useMemo(() => {
        const sorted = [...books];
        sorted.sort((a, b) => compare(a, b, sortColumn, sortDirection));
        return sorted;
    }, [books, sortColumn, sortDirection]);

    function handleSort(columnKey) {
        if (sortColumn === columnKey) {
            setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    }

    function sortableHeading(label, columnKey) {
        return (
            <SortHeader
                label={label}
                columnKey={columnKey}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
            />
        );
    }

    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

    return (
        <div className="books-table-shell">
            <table className="books-table">
                <thead>
                    <tr>
                        {visibleColumns.bookId && <th>{sortableHeading("ID", "book_id")}</th>}
                        {visibleColumns.title && <th>{sortableHeading("Title", "title")}</th>}
                        {visibleColumns.author && <th>{sortableHeading("Author", "author")}</th>}
                        {visibleColumns.isbn && <th>{sortableHeading("ISBN", "isbn")}</th>}
                        {visibleColumns.publisher && <th>{sortableHeading("Publisher", "publisher")}</th>}
                        {visibleColumns.category && <th>{sortableHeading("Category", "category")}</th>}
                        {visibleColumns.price && <th>{sortableHeading("Price", "price")}</th>}
                        {visibleColumns.collectible && <th>Type</th>}
                        {visibleColumns.available && <th>{sortableHeading("Available", "available_quantity")}</th>}
                        {visibleColumns.actions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedBooks.length === 0 ? (
                        <tr><td className="books-empty" colSpan={visibleCount}>No books match the current filters.</td></tr>
                    ) : sortedBooks.map((book) => {
                        const available = canAddInventory ? book.quantity_on_hand : book.available_quantity;
                        return (
                            <tr key={book.book_id}>
                                {visibleColumns.bookId && <td className="book-id">#{book.book_id}</td>}
                                {visibleColumns.title && <td className="book-title">{book.title || "Untitled"}</td>}
                                {visibleColumns.author && <td>{book.author || "Unknown"}</td>}
                                {visibleColumns.isbn && <td className="book-isbn">{book.isbn || "—"}</td>}
                                {visibleColumns.publisher && <td>{book.publisher || "—"}</td>}
                                {visibleColumns.category && <td><span className="book-category">{book.category || "Uncategorized"}</span></td>}
                                {visibleColumns.price && <td className="book-price">${Number(book.price).toFixed(2)}</td>}
                                {visibleColumns.collectible && (
                                    <td><span className={`book-badge ${book.is_collectible ? "collectible" : "standard"}`}>{book.is_collectible ? "Collectible" : "Standard"}</span></td>
                                )}
                                {visibleColumns.available && (
                                    <td><span className={`stock-badge ${Number(available) > 0 ? "in-stock" : "out-of-stock"}`}>{Number(available) > 0 ? `${available} in stock` : "Out of stock"}</span></td>
                                )}
                                {visibleColumns.actions && (
                                    <td>
                                        <div className="book-actions">
                                            {canUpdate && <button onClick={() => onEditBook(book.book_id)}>Edit</button>}
                                            {canAddInventory && book.inventory_id && <button onClick={() => onEditInventory(book.inventory_id)}>Inventory</button>}
                                            {canUseCart && <button onClick={async () => { await addToCart(book.book_id); alert("Added to cart"); }}>Add to Cart</button>}
                                            {onSelectBook && <button onClick={() => onSelectBook(book)}>Add to Sale</button>}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function compare(a, b, column, direction) {
    const multiplier = direction === "asc" ? 1 : -1;
    const value = (book) => {
        if (column === "price") return Number(book.price) || 0;
        if (column === "available_quantity") return Number(book.available_quantity ?? book.quantity_on_hand) || 0;
        if (column === "book_id") return Number(book.book_id) || 0;
        return String(book[column] || "").toLowerCase();
    };
    const left = value(a);
    const right = value(b);
    return (typeof left === "number" ? left - right : left.localeCompare(right)) * multiplier;
}
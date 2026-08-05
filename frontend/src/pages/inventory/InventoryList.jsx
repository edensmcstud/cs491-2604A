import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function InventoryList() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [books, setBooks] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [inventoryList, bookList] = await Promise.all([
                    api.get("/inventory"),
                    api.get("/books")
                ]);

                setInventory(inventoryList);
                setBooks(Object.fromEntries(bookList.map((book) => [book.book_id, book])));
            } catch (err) {
                console.error("InventoryList load error:", err);
                setError(err.response?.data?.error || "Failed to load inventory.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const filteredInventory = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return inventory;

        return inventory.filter((item) => {
            const book = books[item.book_id] || {};
            return [book.title, book.author, book.isbn, book.category]
                .some((value) => String(value || "").toLowerCase().includes(term));
        });
    }, [inventory, books, search]);

    const totals = useMemo(() => inventory.reduce((summary, item) => {
        const onHand = Number(item.quantity_on_hand) || 0;
        const reserved = Number(item.quantity_reserved) || 0;
        const reorderLevel = Number(item.reorder_level) || 0;
        summary.units += onHand;
        summary.reserved += reserved;
        if (onHand <= reorderLevel) summary.lowStock += 1;
        return summary;
    }, { units: 0, reserved: 0, lowStock: 0 }), [inventory]);

    if (loading) {
        return <div className="page inventory-loading"><h1>Inventory</h1><p>Loading inventory...</p></div>;
    }

    return (
        <div className="page inventory-page">
            <div className="inventory-heading">
                <div>
                    <h1>Inventory</h1>
                    <p>Monitor stock levels, reservations, and reorder needs.</p>
                </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="inventory-summary">
                <div className="inventory-stat"><span>Book Titles</span><strong>{inventory.length}</strong></div>
                <div className="inventory-stat"><span>Units on Hand</span><strong>{totals.units}</strong></div>
                <div className="inventory-stat"><span>Reserved</span><strong>{totals.reserved}</strong></div>
                <div className={`inventory-stat ${totals.lowStock > 0 ? "attention" : ""}`}><span>Low Stock</span><strong>{totals.lowStock}</strong></div>
            </div>

            <div className="inventory-search">
                <label htmlFor="inventory-search">Search inventory</label>
                <input
                    id="inventory-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search title, author, ISBN, or category"
                />
                <span>{filteredInventory.length} items shown</span>
            </div>

            <div className="inventory-table-shell">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Book</th>
                            <th>ISBN</th>
                            <th>Type</th>
                            <th>On Hand</th>
                            <th>Reserved</th>
                            <th>Available</th>
                            <th>Reorder At</th>
                            <th>Reorder Qty</th>
                            <th>Status</th>
                            <th>Updated</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.length === 0 ? (
                            <tr><td className="inventory-empty" colSpan="12">No inventory matches your search.</td></tr>
                        ) : filteredInventory.map((item) => {
                            const book = books[item.book_id] || {};
                            const onHand = Number(item.quantity_on_hand) || 0;
                            const reserved = Number(item.quantity_reserved) || 0;
                            const available = Math.max(0, onHand - reserved);
                            const reorderLevel = Number(item.reorder_level) || 0;
                            const lowStock = onHand <= reorderLevel;

                            return (
                                <tr key={item.inventory_id}>
                                    <td className="inventory-id">#{item.inventory_id}</td>
                                    <td>
                                        <strong className="inventory-book-title">{book.title || `Book ${item.book_id}`}</strong>
                                        {book.author && <span className="inventory-book-author">{book.author}</span>}
                                    </td>
                                    <td className="inventory-isbn">{book.isbn || "—"}</td>
                                    <td><span className={`book-badge ${Number(book.is_collectible) === 1 ? "collectible" : "standard"}`}>{Number(book.is_collectible) === 1 ? "Collectible" : "Standard"}</span></td>
                                    <td className="inventory-number">{onHand}</td>
                                    <td className="inventory-number">{reserved}</td>
                                    <td className="inventory-number"><strong>{available}</strong></td>
                                    <td className="inventory-number">{reorderLevel}</td>
                                    <td className="inventory-number">{Number(item.reorder_quantity) || 0}</td>
                                    <td><span className={`stock-badge ${lowStock ? "out-of-stock" : "in-stock"}`}>{lowStock ? "Reorder" : "Healthy"}</span></td>
                                    <td className="inventory-date">{formatDate(item.last_updated)}</td>
                                    <td><button className="inventory-edit-button" onClick={() => navigate(`/inventory/edit/${item.inventory_id}`)}>Edit</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "—";
    const parsed = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}
const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Get all inventory items
 */
exports.getInventory = async (req, res) => {
    try {
        const items = await query(`
            SELECT inventory_id, book_id, quantity_on_hand, quantity_reserved,
                   reorder_level, reorder_quantity, last_updated
            FROM inventory
        `);

        res.json(items);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get a single inventory item
 */
exports.getInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await query(
            `SELECT inventory_id, book_id, quantity_on_hand, quantity_reserved,
                    reorder_level, reorder_quantity, last_updated
             FROM inventory
             WHERE inventory_id = ?`,
            [id]
        );

        if (item.length === 0) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        res.json(item[0]);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Create inventory item
 * Schema requires book_id UNIQUE — one inventory row per book.
 */
exports.createInventoryItem = async (req, res) => {
    try {
        const {
            book_id,
            quantity_on_hand,
            quantity_reserved,
            reorder_level,
            reorder_quantity
        } = req.body;

        if (!book_id) {
            return res.status(400).json({ error: "book_id required" });
        }

        // Ensure book exists
        const bookCheck = await query(
            `SELECT book_id FROM books WHERE book_id = ?`,
            [book_id]
        );

        if (bookCheck.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        // Ensure inventory does not already exist for this book
        const invCheck = await query(
            `SELECT inventory_id FROM inventory WHERE book_id = ?`,
            [book_id]
        );

        if (invCheck.length > 0) {
            return res.status(400).json({ error: "Inventory already exists for this book" });
        }

        const now = new Date().toISOString();

        const result = await run(
            `INSERT INTO inventory
             (book_id, quantity_on_hand, quantity_reserved, reorder_level, reorder_quantity, last_updated)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                book_id,
                quantity_on_hand ?? 0,
                quantity_reserved ?? 0,
                reorder_level ?? 0,
                reorder_quantity ?? 0,
                now
            ]
        );

        const inventoryId = result.lastID;

        await logAction(req.user.user_id, "CREATE", "INVENTORY", inventoryId);

        res.json({ message: "Inventory item created", inventory_id: inventoryId });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Update inventory item
 */
exports.updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            quantity_on_hand,
            quantity_reserved,
            reorder_level,
            reorder_quantity
        } = req.body;

        const now = new Date().toISOString();

        await run(
            `UPDATE inventory SET
                quantity_on_hand = ?,
                quantity_reserved = ?,
                reorder_level = ?,
                reorder_quantity = ?,
                last_updated = ?
             WHERE inventory_id = ?`,
            [
                quantity_on_hand,
                quantity_reserved,
                reorder_level,
                reorder_quantity,
                now,
                id
            ]
        );

        await logAction(req.user.user_id, "UPDATE", "INVENTORY", id);

        res.json({ message: "Inventory item updated" });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Adjust stock levels (quantity_on_hand only)
 */
exports.adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (typeof amount !== "number") {
            return res.status(400).json({ error: "amount must be a number" });
        }

        const itemRows = await query(
            `SELECT quantity_on_hand FROM inventory WHERE inventory_id = ?`,
            [id]
        );

        if (itemRows.length === 0) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        const currentQty = itemRows[0].quantity_on_hand;
        const newQty = currentQty + amount;

        if (newQty < 0) {
            return res.status(400).json({ error: "Stock cannot go below zero" });
        }

        const now = new Date().toISOString();

        await run(
            `UPDATE inventory
             SET quantity_on_hand = ?, last_updated = ?
             WHERE inventory_id = ?`,
            [newQty, now, id]
        );

        await logAction(req.user.user_id, "ADJUST_STOCK", "INVENTORY", id);

        res.json({ message: "Stock adjusted successfully", new_quantity: newQty });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Delete inventory item
 */
exports.deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        await run(
            `DELETE FROM inventory WHERE inventory_id = ?`,
            [id]
        );

        await logAction(req.user.user_id, "DELETE", "INVENTORY", id);

        res.json({ message: "Inventory item deleted" });
    } catch (err) {
        handleError(res, err);
    }
};

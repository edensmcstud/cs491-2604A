// controllers/inventoryController.js

const db = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

// ===============================
// GET ALL INVENTORY ITEMS
// ===============================
exports.getInventory = async (req, res) => {
    try {
        const items = await db.all("SELECT * FROM inventory");
        res.json(items);
    } catch (err) {
        handleError(res, err);
    }
};

// ===============================
// GET SINGLE INVENTORY ITEM
// ===============================
exports.getInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await db.get("SELECT * FROM inventory WHERE id = ?", [id]);

        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        res.json(item);
    } catch (err) {
        handleError(res, err);
    }
};

// ===============================
// CREATE INVENTORY ITEM
// ===============================
exports.createInventoryItem = async (req, res) => {
    try {
        const {
            book_id,
            quantity_on_hand,
            quantity_reserved,
            reorder_level,
            reorder_quantity
        } = req.body;

        const now = Date.now();

        const result = await db.run(
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

        await logAction(req.user.user_id, "CREATE", "INVENTORY", result);

        res.json({ message: "Inventory item created", inventory_id: result });
    } catch (err) {
        handleError(res, err);
    }
};

// ===============================
// UPDATE INVENTORY ITEM
// ===============================
exports.updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            quantity_on_hand,
            quantity_reserved,
            reorder_level,
            reorder_quantity
        } = req.body;

        const now = Date.now();

        await db.run(
            `UPDATE inventory SET 
                quantity_on_hand = ?, 
                quantity_reserved = ?, 
                reorder_level = ?, 
                reorder_quantity = ?, 
                last_updated = ?
            WHERE id = ?`,
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

// ===============================
// ADJUST STOCK LEVELS
// ===============================
exports.adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body; // positive or negative

        const item = await db.get("SELECT * FROM inventory WHERE id = ?", [id]);

        if (!item) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

        const newQty = item.quantity_on_hand + amount;

        if (newQty < 0) {
            return res.status(400).json({ error: "Stock cannot go below zero" });
        }

        const now = Date.now();

        await db.run(
            `UPDATE inventory SET quantity_on_hand = ?, last_updated = ? WHERE id = ?`,
            [newQty, now, id]
        );

        await logAction(req.user.user_id, "ADJUST_STOCK", "INVENTORY", id);

        res.json({ message: "Stock adjusted successfully" });
    } catch (err) {
        handleError(res, err);
    }
};

// ===============================
// DELETE INVENTORY ITEM
// ===============================
exports.deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;

        await db.run("DELETE FROM inventory WHERE id = ?", [id]);

        await logAction(req.user.user_id, "DELETE", "INVENTORY", id);

        res.json({ message: "Inventory item deleted" });
    } catch (err) {
        handleError(res, err);
    }
};

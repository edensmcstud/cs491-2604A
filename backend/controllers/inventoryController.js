const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

// =====================================================
// GET ALL INVENTORY ITEMS (Admin + Employee)
// =====================================================
exports.getInventory = async (req, res) => {
    try {
        const items = await query(`
            SELECT 
                inventory_id, 
                book_id, 
                quantity_on_hand, 
                quantity_reserved,
                reorder_level, 
                reorder_quantity, 
                last_updated
            FROM inventory
        `);

        res.json(items);
    } catch (err) {
        handleError(res, err);
    }
};

// =====================================================
// GET SINGLE INVENTORY ITEM
// =====================================================
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

// =====================================================
// UPDATE INVENTORY METADATA (Admin only)
// Employees should NOT be able to do this.
// =====================================================
exports.updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            quantity_on_hand,
            quantity_reserved,
            reorder_level,
            reorder_quantity
        } = req.body;

        const fields = { quantity_on_hand, quantity_reserved, reorder_level, reorder_quantity };

        for (const [name, value] of Object.entries(fields)) {
            if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
                return res.status(400).json({ error: `${name} must be a number >= 0` });
            }
        }

        const now = new Date().toISOString();

        // Validate inventory exists
        const invCheck = await query(
            `SELECT inventory_id FROM inventory WHERE inventory_id = ?`,
            [id]
        );

        if (invCheck.length === 0) {
            return res.status(404).json({ error: "Inventory item not found" });
        }

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

// =====================================================
// ADJUST STOCK LEVELS (Admin + Employee)
// This is the operational stock change route.
// =====================================================
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
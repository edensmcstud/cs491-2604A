const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a supplier order
 * Flow:
 * 1. Validate supplier_id and created_by (req.user.user_id)
 * 2. Insert into supplier_orders
 * 3. Insert items into supplier_order_items
 * 4. Audit log
 */
exports.createSupplierOrder = async (req, res) => {
    try {
        const { supplier_id, items } = req.body;

        if (!supplier_id || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "supplier_id and items[] required" });
        }

        const createdBy = req.user?.user_id;
        if (!createdBy) {
            return res.status(403).json({ error: "Authentication required" });
        }

        // Step 1: Create supplier order
        const orderResult = await run(
            `INSERT INTO supplier_orders (supplier_id, created_by, status)
             VALUES (?, ?, 'Created')`,
            [supplier_id, createdBy]
        );

        const supplierOrderId = orderResult.lastID;

        // Step 2: Insert items
        for (const item of items) {
            const { book_id, quantity, unit_cost } = item;

            if (!book_id || !quantity || !unit_cost) {
                return res.status(400).json({ error: "Each item requires book_id, quantity, unit_cost" });
            }

            await run(
                `INSERT INTO supplier_order_items (supplier_order_id, book_id, quantity, unit_cost)
                 VALUES (?, ?, ?, ?)`,
                [supplierOrderId, book_id, quantity, unit_cost]
            );
        }

        // Step 3: Audit log
        await logAction(createdBy, "CREATE", "SUPPLIER_ORDER", supplierOrderId);

        res.json({
            message: "Supplier order created",
            supplier_order_id: supplierOrderId
        });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get all supplier orders with items
 */
exports.getSupplierOrders = async (req, res) => {
    try {
        const orders = await query(`
            SELECT so.supplier_order_id, so.supplier_id, so.created_by,
                   so.status, so.created_at
            FROM supplier_orders AS so
            ORDER BY so.created_at DESC
        `);

        // Fetch items for each order
        for (const order of orders) {
            const items = await query(
                `SELECT supplier_order_item_id, book_id, quantity, unit_cost
                 FROM supplier_order_items
                 WHERE supplier_order_id = ?`,
                [order.supplier_order_id]
            );

            order.items = items;
        }

        res.json(orders);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Test route
 */
exports.test = (req, res) => {
    res.json({ message: "supplier orders controller test" });
};

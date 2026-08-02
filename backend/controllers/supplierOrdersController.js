const { query, run } = require("../utils/db");
const { logAction } = require("../utils/audit");

// =====================================================
// CREATE SUPPLIER ORDER (Employee + Admin)
// =====================================================
exports.createSupplierOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "items[] required" });
        }

        const createdBy = req.user?.user_id;
        if (!createdBy) {
            return res.status(403).json({ error: "Authentication required" });
        }

        // This project is a tech demo, so all purchase orders use one
        // automatically-created placeholder supplier.
        let supplierRows = await query(
            `SELECT supplier_id FROM suppliers WHERE name = ? LIMIT 1`,
            ["Demo Supplier"]
        );

        if (supplierRows.length === 0) {
            const supplierResult = await run(
                `INSERT INTO suppliers (name) VALUES (?)`,
                ["Demo Supplier"]
            );
            supplierRows = [{ supplier_id: supplierResult.lastID }];
        }

        const supplierId = supplierRows[0].supplier_id;

        // Validate each item
        for (const item of items) {
            const { book_id, quantity, unit_cost } = item;

            if (!book_id || !quantity || quantity <= 0 || !unit_cost) {
                return res.status(400).json({
                    error: "Each item requires book_id, quantity > 0, and unit_cost"
                });
            }

            const bookRows = await query(
                `SELECT book_id FROM books WHERE book_id = ?`,
                [book_id]
            );

            if (bookRows.length === 0) {
                return res.status(404).json({
                    error: `Book ${book_id} not found`
                });
            }
        }

        // Create supplier order
        const orderResult = await run(
            `INSERT INTO supplier_orders (supplier_id, created_by, status, created_at)
             VALUES (?, ?, 'Created', datetime('now'))`,
            [supplierId, createdBy]
        );

        const supplierOrderId = orderResult.lastID;

        // Insert items
        for (const item of items) {
            const { book_id, quantity, unit_cost } = item;

            await run(
                `INSERT INTO supplier_order_items (supplier_order_id, book_id, quantity, unit_cost)
                 VALUES (?, ?, ?, ?)`,
                [supplierOrderId, book_id, quantity, unit_cost]
            );
        }

        // Audit log
        await logAction(createdBy, "CREATE", "SUPPLIER_ORDER", supplierOrderId);

        res.json({
            message: "Supplier order created",
            supplier_order_id: supplierOrderId
        });

    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

// =====================================================
// GET ALL SUPPLIER ORDERS (Employee + Admin)
// =====================================================
exports.getSupplierOrders = async (req, res) => {
    try {
        const orders = await query(`
            SELECT so.supplier_order_id, so.supplier_id, so.created_by,
                   so.status, so.created_at, s.name AS supplier_name
            FROM supplier_orders AS so
            JOIN suppliers AS s ON so.supplier_id = s.supplier_id
            ORDER BY so.created_at DESC
        `);

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
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

// =====================================================
// GET SINGLE SUPPLIER ORDER (Employee + Admin)
// =====================================================
exports.getSupplierOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        const rows = await query(
            `SELECT so.supplier_order_id, so.supplier_id, so.created_by,
                    so.status, so.created_at, s.name AS supplier_name
             FROM supplier_orders AS so
             JOIN suppliers AS s ON so.supplier_id = s.supplier_id
             WHERE so.supplier_order_id = ?`,
            [orderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Supplier order not found" });
        }

        const order = rows[0];

        const items = await query(
            `SELECT supplier_order_item_id, book_id, quantity, unit_cost
             FROM supplier_order_items
             WHERE supplier_order_id = ?`,
            [orderId]
        );

        order.items = items;

        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

// =====================================================
// RECEIVE SUPPLIER ORDER (Employee + Admin)
// =====================================================
exports.receiveSupplierOrder = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.user_id;

        const rows = await query(
            `SELECT * FROM supplier_orders WHERE supplier_order_id = ?`,
            [orderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Supplier order not found" });
        }

        const order = rows[0];

        if (order.status !== "Created") {
            return res.status(400).json({ error: "Order already received or invalid state" });
        }

        const items = await query(
            `SELECT book_id, quantity FROM supplier_order_items
             WHERE supplier_order_id = ?`,
            [orderId]
        );

        for (const item of items) {
            await run(
                `UPDATE inventory
                 SET quantity_on_hand = quantity_on_hand + ?
                 WHERE book_id = ?`,
                [item.quantity, item.book_id]
            );
        }

        await run(
            `UPDATE supplier_orders
             SET status = 'Received'
             WHERE supplier_order_id = ?`,
            [orderId]
        );

        await logAction(userId, "RECEIVE", "SUPPLIER_ORDER", orderId);

        res.json({ message: "Supplier order received and inventory updated" });

    } catch (err) {
        next(err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "Supplier Orders Test OK" });
};

const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a customer order
 * Flow:
 * 1. Validate items[]
 * 2. Calculate subtotal, tax, total
 * 3. Insert into customer_orders
 * 4. Insert customer_order_items
 * 5. Update inventory reserved quantities
 * 6. Audit log
 */
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "items[] required" });
        }

        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(403).json({ error: "Authentication required" });
        }

        // Fetch customer_id from customers table
        const customerRows = await query(
            `SELECT customer_id FROM customers WHERE user_id = ?`,
            [userId]
        );

        if (customerRows.length === 0) {
            return res.status(403).json({ error: "User is not a customer" });
        }

        const customerId = customerRows[0].customer_id;

        // Step 1: Calculate totals
        let subtotal = 0;

        for (const item of items) {
            const { book_id, quantity } = item;

            if (!book_id || !quantity) {
                return res.status(400).json({ error: "Each item requires book_id and quantity" });
            }

            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ?`,
                [book_id]
            );

            if (bookRows.length === 0) {
                return res.status(404).json({ error: `Book ${book_id} not found` });
            }

            const unitPrice = bookRows[0].price;
            subtotal += unitPrice * quantity;
        }

        const taxRate = 0.07; // example
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Step 2: Insert order
        const orderResult = await run(
            `INSERT INTO customer_orders (customer_id, status, subtotal, tax, total)
             VALUES (?, 'Pending', ?, ?, ?)`,
            [customerId, subtotal, tax, total]
        );

        const orderId = orderResult.lastID;

        // Step 3: Insert order items + update inventory reserved quantities
        for (const item of items) {
            const { book_id, quantity } = item;

            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ?`,
                [book_id]
            );

            const unitPrice = bookRows[0].price;
            const lineTotal = unitPrice * quantity;

            // Insert order item
            await run(
                `INSERT INTO customer_order_items (order_id, book_id, quantity, unit_price, line_total)
                 VALUES (?, ?, ?, ?, ?)`,
                [orderId, book_id, quantity, unitPrice, lineTotal]
            );

            // Update inventory reserved quantity
            await run(
                `UPDATE inventory
                 SET quantity_reserved = quantity_reserved + ?
                 WHERE book_id = ?`,
                [quantity, book_id]
            );
        }

        // Step 4: Audit log
        await logAction(userId, "CREATE", "CUSTOMER_ORDER", orderId);

        res.json({
            message: "Order created",
            order_id: orderId,
            subtotal,
            tax,
            total
        });
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Get order status
 */
exports.getOrderStatus = async (req, res) => {
    try {
        const rows = await query(
            `SELECT order_id, customer_id, order_date, status, subtotal, tax, total
             FROM customer_orders
             WHERE order_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.json(null);
        }

        const order = rows[0];

        const items = await query(
            `SELECT order_item_id, book_id, quantity, unit_price, line_total
             FROM customer_order_items
             WHERE order_id = ?`,
            [order.order_id]
        );

        order.items = items;

        res.json(order);
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Cancel order
 * Flow:
 * 1. Update status
 * 2. Reduce reserved inventory
 * 3. Audit log
 */
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Fetch items to reverse reserved inventory
        const items = await query(
            `SELECT book_id, quantity
             FROM customer_order_items
             WHERE order_id = ?`,
            [orderId]
        );

        // Reverse reserved inventory
        for (const item of items) {
            await run(
                `UPDATE inventory
                 SET quantity_reserved = quantity_reserved - ?
                 WHERE book_id = ?`,
                [item.quantity, item.book_id]
            );
        }

        // Update order status
        await run(
            `UPDATE customer_orders
             SET status = 'Cancelled'
             WHERE order_id = ?`,
            [orderId]
        );

        await logAction(req.user.user_id, "CANCEL", "CUSTOMER_ORDER", orderId);

        res.json({ message: "Order cancelled" });
    } catch (err) {
        handleError(res, err);
    }
};


exports.test = (req, res) => {
    res.json({ message: "orders controller test" });
};

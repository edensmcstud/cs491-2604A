const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a customer order
 * Flow:
 * 1. Validate customer_id and items[]
 * 2. Validate customer exists
 * 3. Validate books exist
 * 4. Calculate subtotal, tax, total
 * 5. Insert into customer_orders
 * 6. Insert into customer_order_items
 * 7. Audit log
 */
exports.createCustomerOrder = async (req, res) => {
    try {
        const { customer_id, items } = req.body;

if (!customer_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
    error: "customer_id and items[] required"
    });
}

// Validate customer exists
const custRows = await query(
    `SELECT customer_id
     FROM customers
     WHERE customer_id = ?`,
    [customer_id]
);

if (custRows.length === 0) {
    return res.status(404).json({
        error: "Customer not found"
    });
}

        // Validate items + calculate totals
        let subtotal = 0;

        for (const item of items) {
            const { book_id, quantity } = item;

            if (!book_id || !quantity || quantity <= 0) {
                return res.status(400).json({
                    error: "Each item requires book_id and quantity > 0"
                });
            }

            const bookRows = await query(
                `SELECT b.title,
                    b.price,
                    i.quantity_on_hand,
                    i.quantity_reserved
                FROM books AS b
                JOIN inventory AS i ON b.book_id = i.book_id
                WHERE b.book_id = ? AND b.active = 1`,
                [book_id]
            );

            if (bookRows.length === 0) {
                return res.status(404).json({
                    error: `Book ${book_id} was not found, is inactive, or has no inventory record`
                });
            }

            const availableQuantity =
                bookRows[0].quantity_on_hand - bookRows[0].quantity_reserved;

            if (quantity > availableQuantity) {
                return res.status(400).json({
                error: `Only ${availableQuantity} copies of "${bookRows[0].title}" are available`
                });
            }

            const unitPrice = bookRows[0].price;
            subtotal += unitPrice * quantity;
        }

        const taxRate = 0.07;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Insert order
        const orderResult = await run(
            `INSERT INTO customer_orders (customer_id, subtotal, tax, total, status)
             VALUES (?, ?, ?, ?, 'Pending')`,
            [customer_id, subtotal, tax, total]
        );

        const orderId = orderResult.lastID;

        // Insert items
        for (const item of items) {
            const { book_id, quantity } = item;

            const bookRows = await query(
            `SELECT price FROM books WHERE book_id = ?`,
            [book_id]
        );

            const unitPrice = bookRows[0].price;
            const lineTotal = unitPrice * quantity;

        await run(
            `INSERT INTO customer_order_items
            (order_id, book_id, quantity, unit_price, line_total)
            VALUES (?, ?, ?, ?, ?)`,
            [orderId, book_id, quantity, unitPrice, lineTotal]
        );

        await run(
            `UPDATE inventory
            SET quantity_reserved = quantity_reserved + ?
            WHERE book_id = ?`,
            [quantity, book_id]
        );
    }   

        await logAction(req.user.user_id, "CREATE", "CUSTOMER_ORDER", orderId);

        res.json({
            message: "Customer order created",
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
 * Get all customer orders (Admin + Employee)
 */
exports.getCustomerOrders = async (req, res) => {
    try {
        const orders = await query(`
            SELECT co.order_id, co.customer_id, co.order_date, co.status,
                   co.subtotal, co.tax, co.total,
                   c.first_name, c.last_name
            FROM customer_orders AS co
            JOIN customers AS c ON co.customer_id = c.customer_id
            ORDER BY co.order_date DESC
        `);

        for (const order of orders) {
            const items = await query(
                `SELECT order_item_id, book_id, quantity, unit_price, line_total
                 FROM customer_order_items
                 WHERE order_id = ?`,
                [order.order_id]
            );

            order.items = items;
        }

        res.json(orders);

    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get a single customer order
 */
exports.getCustomerOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const rows = await query(
            `SELECT co.order_id, co.customer_id, co.order_date, co.status,
                    co.subtotal, co.tax, co.total,
                    c.first_name, c.last_name
             FROM customer_orders AS co
             JOIN customers AS c ON co.customer_id = c.customer_id
             WHERE co.order_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = rows[0];

        const items = await query(
            `SELECT order_item_id, book_id, quantity, unit_price, line_total
             FROM customer_order_items
             WHERE order_id = ?`,
            [id]
        );

        order.items = items;

        res.json(order);

    } catch (err) {
        handleError(res, err);
    }
};

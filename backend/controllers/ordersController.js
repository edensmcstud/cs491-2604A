const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a customer order
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

        // Fetch customer_id
        const customerRows = await query(
            `SELECT customer_id FROM customers WHERE user_id = ?`,
            [userId]
        );

        if (customerRows.length === 0) {
            return res.status(403).json({ error: "User is not a customer" });
        }

        const customerId = customerRows[0].customer_id;

        // Step 1: Calculate totals + validate stock
        let subtotal = 0;

        for (const item of items) {
            const { book_id, quantity } = item;

            if (!book_id || !quantity) {
                return res.status(400).json({ error: "Each item requires book_id and quantity" });
            }

            // Fetch price + stock
            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ? AND active = 1`,
                [book_id]
            );

            if (bookRows.length === 0) {
                return res.status(404).json({ error: `Book ${book_id} not found or inactive` });
            }

            const invRows = await query(
                `SELECT quantity_on_hand, quantity_reserved
                 FROM inventory
                 WHERE book_id = ?`,
                [book_id]
            );

            if (invRows.length === 0) {
                return res.status(404).json({ error: `Inventory missing for book ${book_id}` });
            }

            const { quantity_on_hand, quantity_reserved } = invRows[0];
            const available = quantity_on_hand - quantity_reserved;

            if (quantity > available) {
                return res.status(400).json({
                    error: `Not enough stock for book ${book_id}. Requested ${quantity}, available ${available}`
                });
            }

            const unitPrice = bookRows[0].price;
            subtotal += unitPrice * quantity;
        }

        const taxRate = 0.07;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Step 2: Insert order
        const orderResult = await run(
            `INSERT INTO customer_orders (customer_id, status, subtotal, tax, total)
             VALUES (?, 'Pending', ?, ?, ?)`,
            [customerId, subtotal, tax, total]
        );

        const orderId = orderResult.lastID;

        // Step 3: Insert items + reserve inventory
        for (const item of items) {
            const { book_id, quantity } = item;

            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ?`,
                [book_id]
            );

            const unitPrice = bookRows[0].price;
            const lineTotal = unitPrice * quantity;

            await run(
                `INSERT INTO customer_order_items (order_id, book_id, quantity, unit_price, line_total)
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
 * - Customer: only their own orders
 * - Employee/Admin: any order
 */
exports.getOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;

        const rows = await query(
            `SELECT order_id, customer_id, order_date, status, subtotal, tax, total
             FROM customer_orders
             WHERE order_id = ?`,
            [orderId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = rows[0];

        // Ownership check for customers
        const isCustomer = req.user.roles.includes("Customer");

        if (isCustomer) {
            const customerRows = await query(
                `SELECT customer_id FROM customers WHERE user_id = ?`,
                [req.user.user_id]
            );

            if (customerRows.length === 0 || customerRows[0].customer_id !== order.customer_id) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

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
 * List all pending orders (Employee/Admin only)
 */
exports.listPendingOrders = async (req, res) => {
    try {
        const orders = await query(
            `SELECT order_id, customer_id, order_date, status, subtotal, tax, total
             FROM customer_orders
             WHERE status = 'Pending'
             ORDER BY order_date ASC`
        );

        // Load items for each order
        for (const order of orders) {
            const items = await query(
                `SELECT coi.order_item_id,
                        coi.book_id,
                        b.title,
                        coi.quantity,
                        coi.unit_price,
                        coi.line_total
                 FROM customer_order_items coi
                 JOIN books b ON b.book_id = coi.book_id
                 WHERE coi.order_id = ?`,
                [order.order_id]
            );

            order.items = items;
        }

        res.json({ orders });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Cancel order
 * - Customer: only their own orders
 * - Employee/Admin: any order
 */
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const { fulfillment_type } = req.body;

        // Validate fulfillment type
        const type = fulfillment_type === "InStore" ? "InStore" : "Shipped";

        const orderRows = await query(
            `SELECT customer_id, status FROM customer_orders WHERE order_id = ?`,
            [orderId]
        );

        if (orderRows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = orderRows[0];

        // Ownership check for customers
        const isCustomer = req.user.roles.includes("Customer");

        if (isCustomer) {
            const customerRows = await query(
                `SELECT customer_id FROM customers WHERE user_id = ?`,
                [req.user.user_id]
            );

            if (customerRows.length === 0 || customerRows[0].customer_id !== order.customer_id) {
                return res.status(403).json({ error: "Access denied" });
            }
        }

        // Reverse reserved inventory
        const items = await query(
            `SELECT book_id, quantity
             FROM customer_order_items
             WHERE order_id = ?`,
            [orderId]
        );

        for (const item of items) {
            await run(
                `UPDATE inventory
                 SET quantity_reserved = quantity_reserved - ?
                 WHERE book_id = ?`,
                [item.quantity, item.book_id]
            );
        }

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

/**
 * Fulfill (ship) an order
 * - Employee/Admin only
 * - Converts reserved inventory into consumed inventory
 * - Marks order as Shipped
 */
exports.fulfillOrder = async (req, res) => {
    let transactionStarted = false;

    try {
        const orderId = req.params.id;

        // Load order
        const orderRows = await query(
            `SELECT status
             FROM customer_orders
             WHERE order_id = ?`,
            [orderId]
        );

        if (orderRows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const { status } = orderRows[0];

        if (status !== "Pending") {
            return res.status(400).json({ error: "Order is not pending" });
        }

        // Load order items
        const items = await query(
            `SELECT book_id, quantity
             FROM customer_order_items
             WHERE order_id = ?`,
            [orderId]
        );

        if (items.length === 0) {
            return res.status(400).json({ error: "Order has no items" });
        }

        // Begin transaction
        await run("BEGIN TRANSACTION");
        transactionStarted = true;

        // Consume reserved inventory
        for (const item of items) {
            const invRows = await query(
                `SELECT quantity_on_hand, quantity_reserved
                 FROM inventory
                 WHERE book_id = ?`,
                [item.book_id]
            );

            if (invRows.length === 0) {
                throw new Error(`Inventory missing for book ${item.book_id}`);
            }

            const { quantity_on_hand, quantity_reserved } = invRows[0];

            if (quantity_reserved < item.quantity) {
                throw new Error(
                    `Reserved quantity mismatch for book ${item.book_id}`
                );
            }

            await run(
                `UPDATE inventory
                 SET quantity_on_hand = quantity_on_hand - ?,
                     quantity_reserved = quantity_reserved - ?
                 WHERE book_id = ?`,
                [item.quantity, item.quantity, item.book_id]
            );
        }

        // Mark order shipped
        await run(
            `UPDATE customer_orders
             SET status = 'Shipped',
                 fulfillment_type = ?
             WHERE order_id = ?`,
            [req.body.fulfillment_type || "Shipped", orderId]
        );

        await logAction(req.user.user_id, "FULFILL", "CUSTOMER_ORDER", orderId);

        // === INSERT SALE FROM FULFILLMENT ===

        const orderDetails = await query(
            `SELECT customer_id, subtotal, tax, total, fulfillment_type
             FROM customer_orders
             WHERE order_id = ?`,
            [orderId]
        );

        if (orderDetails.length === 0) {
            throw new Error("Order details missing during fulfillment → sale insertion aborted");
        }

        const order = orderDetails[0];

        // employee_id = user_id (because your DB has no employees table)
        const employeeId = req.user.user_id;

        await run(
            `INSERT INTO sales (
                employee_id,
                customer_id,
                sale_date,
                subtotal,
                tax,
                total,
                sale_source,
                fulfillment_type,
                payment_method
            ) VALUES (?, ?, datetime('now'), ?, ?, ?, 'Fulfillment', ?, 'Card')`,
            [
                employeeId,
                order.customer_id,
                order.subtotal,
                order.tax,
                order.total,
                order.fulfillment_type
            ]
        );

        const saleIdRow = await query(`SELECT last_insert_rowid() AS sale_id`);
        const saleId = saleIdRow[0].sale_id;

        const orderItems = await query(
            `SELECT book_id, quantity, unit_price, line_total
             FROM customer_order_items
             WHERE order_id = ?`,
            [orderId]
        );

        for (const item of orderItems) {
            await run(
                `INSERT INTO sale_items (
                    sale_id,
                    book_id,
                    quantity,
                    unit_price,
                    line_total
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    saleId,
                    item.book_id,
                    item.quantity,
                    item.unit_price,
                    item.line_total
                ]
            );
        }

        await run("COMMIT");
        transactionStarted = false;

        res.json({ message: "Order fulfilled (shipped)" });

    } catch (err) {
        if (transactionStarted) {
            await run("ROLLBACK");
        }
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "orders controller test" });
};
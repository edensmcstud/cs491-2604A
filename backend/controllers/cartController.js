const { query, run } = require("../utils/db");
const { logAction } = require("../utils/audit");

/**
 * ============================
 * GET /cart
 * ============================
 */
exports.getCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        const rows = await query(
            `SELECT ci.book_id,
                    ci.quantity,
                    b.title,
                    b.price
             FROM cart_items ci
             JOIN books b ON b.book_id = ci.book_id
             WHERE ci.user_id = ?`,
            [user_id]
        );

        const items = rows.map(r => ({
            book_id: r.book_id,
            title: r.title,
            price: r.price,
            quantity: r.quantity,
            subtotal: r.price * r.quantity
        }));

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({ items, total });
    } catch (err) {
        console.error("GET /cart error:", err);
        res.status(500).json({ error: "Failed to load cart" });
    }
};

/**
 * ============================
 * POST /cart/add
 * ============================
 */
exports.addToCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const { book_id, quantity } = req.body;

        // Basic input validation
        if (!book_id || !quantity || quantity < 1) {
            return res.status(400).json({ error: "Invalid book or quantity" });
        }

        // Load inventory for this book
        const invRows = await query(
            `SELECT quantity_on_hand, quantity_reserved
             FROM inventory
             WHERE book_id = ?`,
            [book_id]
        );

        if (invRows.length === 0) {
            return res.status(404).json({ error: "Inventory record not found" });
        }

        const { quantity_on_hand, quantity_reserved } = invRows[0];

        // Compute effective available stock
        const effectiveAvailable = quantity_on_hand - quantity_reserved;

        if (effectiveAvailable <= 0) {
            return res.status(400).json({
                error: "No stock available for this book"
            });
        }

        // Check existing cart quantity for this user/book
        const existing = await query(
            `SELECT quantity
             FROM cart_items
             WHERE user_id = ? AND book_id = ?`,
            [user_id, book_id]
        );

        const currentQty = existing.length > 0 ? existing[0].quantity : 0;
        const newQty = currentQty + quantity;

        // Enforce that cart quantity cannot exceed effective available stock
        if (newQty > effectiveAvailable) {
            return res.status(400).json({
                error: "Not enough stock available",
                details: {
                    requested_total_quantity: newQty,
                    available_quantity: effectiveAvailable
                }
            });
        }

        // Insert or update cart item
        if (existing.length > 0) {
            await run(
                `UPDATE cart_items
                 SET quantity = ?
                 WHERE user_id = ? AND book_id = ?`,
                [newQty, user_id, book_id]
            );
        } else {
            await run(
                `INSERT INTO cart_items (user_id, book_id, quantity, added_at)
                 VALUES (?, ?, ?, datetime('now'))`,
                [user_id, book_id, quantity]
            );
        }

        res.json({ message: "Added to cart" });
    } catch (err) {
        console.error("POST /cart/add error:", err);
        res.status(500).json({ error: "Failed to add to cart" });
    }
};


/**
 * ============================
 * DELETE /cart/remove/:book_id
 * ============================
 */
exports.removeFromCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const book_id = req.params.book_id;

        const result = await run(
            `DELETE FROM cart_items
             WHERE user_id = ? AND book_id = ?`,
            [user_id, book_id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        res.json({ message: "Item removed" });
    } catch (err) {
        console.error("DELETE /cart/remove error:", err);
        res.status(500).json({ error: "Failed to remove item" });
    }
};

/**
 * ============================
 * DELETE /cart
 * ============================
 */
exports.clearCart = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        await run(
            `DELETE FROM cart_items
             WHERE user_id = ?`,
            [user_id]
        );

        res.json({ message: "Cart cleared" });
    } catch (err) {
        console.error("DELETE /cart error:", err);
        res.status(500).json({ error: "Failed to clear cart" });
    }
};

/**
 * ============================
 * POST /cart/checkout
 * ============================
 * Auto‑creates a customer profile if missing.
 */
exports.checkout = async (req, res) => {
    let transactionStarted = false;

    try {
        const user_id = req.user.user_id;

        // Load cart
        const cart = await query(
            `SELECT ci.book_id,
       ci.quantity,
       b.price,
       inv.quantity_on_hand,
       inv.quantity_reserved
FROM cart_items ci
JOIN books b ON b.book_id = ci.book_id
JOIN inventory inv ON inv.book_id = ci.book_id
WHERE ci.user_id = ?
`,
            [user_id]
        );

        if (cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Validate effective stock (quantity_on_hand - quantity_reserved)
        for (const item of cart) {
            const effectiveAvailable = item.quantity_on_hand - item.quantity_reserved;

            if (effectiveAvailable < item.quantity) {
                return res.status(400).json({
                    error: "INSUFFICIENT_STOCK",
                    message: `Not enough stock for book ${item.book_id}`,
                    details: {
                        requested_quantity: item.quantity,
                        available_quantity: effectiveAvailable
                    }
                });
            }
        }

        // Ensure customer exists
        let customerRow = await query(
            `SELECT customer_id FROM customers WHERE user_id = ?`,
            [user_id]
        );

        if (customerRow.length === 0) {
            // Create a minimal customer record (schema allows NULLs now)
            await run(
                `INSERT INTO customers (user_id)
         VALUES (?)`,
                [user_id]
            );

            customerRow = await query(
                `SELECT customer_id FROM customers WHERE user_id = ?`,
                [user_id]
            );
        }

        const customer_id = customerRow[0].customer_id;

        // Begin transaction
        await run("BEGIN TRANSACTION");
        transactionStarted = true;

        // Create order
        const orderResult = await run(
            `INSERT INTO customer_orders
             (customer_id, order_date, status, subtotal, tax, total)
             VALUES (?, datetime('now'), 'Pending', 0, 0, 0)`,
            [customer_id]
        );

        const order_id = orderResult.lastID;

        let subtotal = 0;

        // Create order items + reduce inventory
        for (const item of cart) {
            const line_total = item.price * item.quantity;
            subtotal += line_total;

            await run(
                `INSERT INTO customer_order_items
                 (order_id, book_id, quantity, unit_price, line_total)
                 VALUES (?, ?, ?, ?, ?)`,
                [order_id, item.book_id, item.quantity, item.price, line_total]
            );

            await run(
                `UPDATE inventory
                SET quantity_reserved = quantity_reserved + ?
                 WHERE book_id = ?`,
                [item.quantity, item.book_id]
            );
        }

        const tax = subtotal * 0.07;
        const total = subtotal + tax;

        await run(
            `UPDATE customer_orders
             SET subtotal = ?, tax = ?, total = ?
             WHERE order_id = ?`,
            [subtotal, tax, total, order_id]
        );

        // Clear cart
        await run(
            `DELETE FROM cart_items
             WHERE user_id = ?`,
            [user_id]
        );

        await logAction(user_id, "CHECKOUT", "ORDER", order_id);

        await run("COMMIT");
        transactionStarted = false;

        res.json({
            message: "Order placed successfully",
            order_id
        });
    } catch (err) {
        if (transactionStarted) {
            await run("ROLLBACK");
        }

        console.error("POST /cart/checkout error:", err);
        res.status(500).json({ error: "Checkout failed" });
    }
};

/**
 * ============================
 * DELETE /cart/decrement/:book_id
 * ============================
 */
exports.decrementItem = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const book_id = req.params.book_id;

        const rows = await query(
            `SELECT quantity FROM cart_items
             WHERE user_id = ? AND book_id = ?`,
            [user_id, book_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        const currentQty = rows[0].quantity;

        if (currentQty > 1) {
            await run(
                `UPDATE cart_items
                 SET quantity = quantity - 1
                 WHERE user_id = ? AND book_id = ?`,
                [user_id, book_id]
            );
        } else {
            await run(
                `DELETE FROM cart_items
                 WHERE user_id = ? AND book_id = ?`,
                [user_id, book_id]
            );
        }

        res.json({ message: "Quantity updated" });
    } catch (err) {
        console.error("DELETE /cart/decrement error:", err);
        res.status(500).json({ error: "Failed to decrement item" });
    }
};

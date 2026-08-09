const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Create a sale
 * Flow:
 * 1. Validate items[]
 * 2. Validate inventory availability
 * 3. Calculate subtotal, tax, total
 * 4. Insert into sales
 * 5. Insert sale_items
 * 6. Update inventory (reduce quantity_on_hand)
 * 7. Audit log
 */
exports.createSale = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "items[] required" });
        }

        const employeeId = req.user?.user_id;
        if (!employeeId) {
            return res.status(403).json({ error: "Authentication required" });
        }

        // Step 1: Validate stock + calculate totals
        let subtotal = 0;

        for (const item of items) {
            const { book_id, quantity } = item;

            if (!book_id || !quantity || quantity <= 0 || !Number.isInteger(quantity)) {
                return res.status(400).json({
                    error: "Each item requires book_id and a whole number quantity greater than 0"
                });
            }

            // Fetch price
            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ? AND active = 1`,
                [book_id]
            );

            if (bookRows.length === 0) {
                return res.status(404).json({ error: `Book ${book_id} not found or inactive` });
            }

            // Fetch inventory
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

        const taxRate = 0.07; // example
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // Step 2: Insert sale
        const saleResult = await run(
            `INSERT INTO sales (employee_id, subtotal, tax, total)
             VALUES (?, ?, ?, ?)`,
            [employeeId, subtotal, tax, total]
        );

        const saleId = saleResult.lastID;

        // Step 3: Insert sale_items + update inventory
        for (const item of items) {
            const { book_id, quantity } = item;

            const bookRows = await query(
                `SELECT price FROM books WHERE book_id = ?`,
                [book_id]
            );

            const unitPrice = bookRows[0].price;
            const lineTotal = unitPrice * quantity;

            // Insert sale item
            await run(
                `INSERT INTO sale_items (sale_id, book_id, quantity, unit_price, line_total)
                 VALUES (?, ?, ?, ?, ?)`,
                [saleId, book_id, quantity, unitPrice, lineTotal]
            );

            // Reduce inventory
            const now = new Date().toISOString();

            await run(
                `UPDATE inventory
                 SET quantity_on_hand = quantity_on_hand - ?, last_updated = ?
                 WHERE book_id = ?`,
                [quantity, now, book_id]
            );
        }

        // Step 4: Audit log
        await logAction(employeeId, "CREATE", "SALE", saleId);

        res.json({
            message: "Sale created",
            sale_id: saleId,
            subtotal,
            tax,
            total
        });
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Get all sales with items
 */
exports.getSales = async (req, res) => {
    try {
        const sales = await query(`
            SELECT sale_id, employee_id, sale_date, subtotal, tax, total
            FROM sales
            ORDER BY sale_date DESC
        `);

        for (const sale of sales) {
            const items = await query(
                `SELECT sale_item_id, book_id, quantity, unit_price, line_total
                 FROM sale_items
                 WHERE sale_id = ?`,
                [sale.sale_id]
            );

            sale.items = items;
        }

        res.json(sales);
    } catch (err) {
        handleError(res, err);
    }
};

/**
 * Test route
 */
exports.test = (req, res) => {
    res.json({ message: "sales controller test" });
};

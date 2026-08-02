const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

/**
 * Get all sales with items
 */
exports.getSales = async (req, res) => {
    try {
        const sales = await query(`
            SELECT 
                sale_id,
                employee_id,
                sale_date,
                subtotal,
                tax,
                total,
                payment_method,
                sale_source,
                fulfillment_type,
                notes,
                status
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
 * Get a single sale with items
 */
exports.getSale = async (req, res) => {
    try {
        const saleId = req.params.id;

        const saleRows = await query(
            `SELECT 
                sale_id,
                employee_id,
                sale_date,
                subtotal,
                tax,
                total,
                payment_method,
                sale_source,
                fulfillment_type,
                notes,
                status
             FROM sales
             WHERE sale_id = ?`,
            [saleId]
        );

        if (saleRows.length === 0) {
            return res.status(404).json({ error: "Sale not found" });
        }

        const sale = saleRows[0];

        const items = await query(
            `SELECT 
                si.sale_item_id,
                si.book_id,
                b.title,
                si.quantity,
                si.unit_price,
                si.line_total
             FROM sale_items si
             JOIN books b ON si.book_id = b.book_id
             WHERE si.sale_id = ?`,
            [saleId]
        );

        sale.items = items;

        res.json(sale);
    } catch (err) {
        handleError(res, err);
    }
};

// =====================================================
// POS SALE — Inventory Safe (matches your schema)
// =====================================================

exports.createPosSale = async (req, res) => {
    const db = require("../utils/db");
    const { items, payment_method } = req.body;
    const employee_id = req.user.user_id;

    try {
        await db.run("BEGIN TRANSACTION");

        // 1. Validate inventory
        for (const item of items) {
            const stock = await db.get(
                "SELECT quantity_on_hand FROM inventory WHERE book_id = ?",
                [item.book_id]
            );

            if (!stock) {
                await db.run("ROLLBACK");
                return res.status(400).json({
                    error: `Inventory record missing for book_id ${item.book_id}`
                });
            }

            if (stock.quantity_on_hand < item.quantity) {
                await db.run("ROLLBACK");
                return res.status(400).json({
                    error: `Not enough stock for book_id ${item.book_id}. In stock: ${stock.quantity_on_hand}, requested: ${item.quantity}`
                });
            }
        }

        // 2. Compute totals
        const subtotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const tax = subtotal * 0.07;
        const total = subtotal + tax;

        // 3. Insert sale header
        const saleResult = await db.run(
            `INSERT INTO sales (
                employee_id,
                payment_method,
                sale_source,
                fulfillment_type,
                subtotal,
                tax,
                total
            ) VALUES (?, ?, 'POS', 'InStore', ?, ?, ?)`,
            [employee_id, payment_method, subtotal, tax, total]
        );

        const sale_id = saleResult.lastID;

        // 4. Insert items + deduct inventory
        for (const item of items) {
            const line_total = item.price * item.quantity;

            await db.run(
                `INSERT INTO sale_items (
                    sale_id,
                    book_id,
                    quantity,
                    unit_price,
                    line_total
                ) VALUES (?, ?, ?, ?, ?)`,
                [sale_id, item.book_id, item.quantity, item.price, line_total]
            );

            await db.run(
                `UPDATE inventory
                 SET quantity_on_hand = quantity_on_hand - ?
                 WHERE book_id = ?`,
                [item.quantity, item.book_id]
            );
        }

        // 5. Commit
        await db.run("COMMIT");

        return res.json({ sale_id });

    } catch (err) {
        console.error("POS SALE ERROR:", err);
        await db.run("ROLLBACK");

        return res.status(500).json({
            error: "Internal POS error — check server logs"
        });
    }
};

/**
 * Get full receipt details for a sale
 */
exports.getReceipt = async (req, res, next) => {
    try {
        const saleId = req.params.id;

        const saleRows = await query(
            `SELECT 
                s.sale_id,
                s.sale_date,
                s.subtotal,
                s.tax,
                s.total,
                s.payment_method,
                s.sale_source,
                s.fulfillment_type,
                s.notes,
                s.status,

                u.user_id AS employee_id,
                u.username AS employee_username,
                u.email AS employee_email,

                c.customer_id,
                c.first_name AS customer_first_name,
                c.last_name AS customer_last_name,
                c.phone AS customer_phone,
                c.address AS customer_address

             FROM sales s
             LEFT JOIN users u ON s.employee_id = u.user_id
             LEFT JOIN customers c ON s.customer_id = c.customer_id
             WHERE s.sale_id = ?`,
            [saleId]
        );

        if (saleRows.length === 0) {
            return res.status(404).json({ error: "Sale not found" });
        }

        const sale = saleRows[0];

        const itemRows = await query(
            `SELECT 
                si.sale_item_id,
                si.book_id,
                si.quantity,
                si.unit_price,
                si.line_total,
                b.title,
                b.author,
                b.isbn
             FROM sale_items si
             JOIN books b ON si.book_id = b.book_id
             WHERE si.sale_id = ?`,
            [saleId]
        );

        const receipt = {
            sale_id: sale.sale_id,
            sale_date: sale.sale_date,
            payment_method: sale.payment_method,
            sale_source: sale.sale_source,
            fulfillment_type: sale.fulfillment_type,
            notes: sale.notes,
            status: sale.status,

            totals: {
                subtotal: sale.subtotal,
                tax: sale.tax,
                total: sale.total
            },

            employee: sale.employee_id
                ? {
                    employee_id: sale.employee_id,
                    username: sale.employee_username,
                    email: sale.employee_email
                }
                : null,

            customer: sale.customer_id
                ? {
                    customer_id: sale.customer_id,
                    first_name: sale.customer_first_name,
                    last_name: sale.customer_last_name,
                    phone: sale.customer_phone,
                    address: sale.customer_address
                }
                : null,

            items: itemRows
        };

        res.json(receipt);

    } catch (err) {
        next(err);
    }
};

/**
 * Test route
 */
exports.test = (req, res) => {
    res.json({ message: "sales controller test" });
};

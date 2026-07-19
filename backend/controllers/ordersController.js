const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        // TODO: calculate totals
        const subtotal = 0;
        const tax = 0;
        const total = 0;

        const orderId = await run(
            `INSERT INTO customer_orders (customer_id, status, subtotal, tax, total)
             VALUES (?, 'pending', ?, ?, ?)`,
            [req.user.customer_id, subtotal, tax, total]
        );

        await logAction(req.user.customer_id, "CREATE", "ORDER", orderId);

        res.json({ message: "Order created", order_id: orderId });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getOrderStatus = async (req, res) => {
    try {
        const rows = await query(
            "SELECT * FROM customer_orders WHERE customer_order_id = ?",
            [req.params.id]
        );
        res.json(rows[0] || null);
    } catch (err) {
        handleError(res, err);
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        await run(
            `UPDATE customer_orders SET status = 'cancelled' WHERE customer_order_id = ?`,
            [req.params.id]
        );

        await logAction(req.user.customer_id, "CANCEL", "ORDER", req.params.id);

        res.json({ message: "Order cancelled" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "orders controller test" });
};

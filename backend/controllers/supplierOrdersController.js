const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.createSupplierOrder = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;

        const id = await run(
            `INSERT INTO supplier_orders (book_id, quantity, status)
             VALUES (?, ?, 'pending')`,
            [book_id, quantity]
        );

        await logAction(req.user.user_id, "CREATE", "SUPPLIER_ORDER", id);

        res.json({ message: "Supplier order created", supplier_order_id: id });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getSupplierOrders = async (req, res) => {
    try {
        const orders = await query("SELECT * FROM supplier_orders");
        res.json(orders);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "supplier orders controller test" });
};

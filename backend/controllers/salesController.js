const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.createSale = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;

        // TODO: calculate subtotal, tax, total
        const subtotal = 0;
        const tax = 0;
        const total = 0;

        const id = await run(
            `INSERT INTO sales (user_id, subtotal, tax, total)
             VALUES (?, ?, ?, ?)`,
            [req.user.user_id, subtotal, tax, total]
        );

        await logAction(req.user.user_id, "CREATE", "SALE", id);

        res.json({ message: "Sale created", sale_id: id });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await query("SELECT * FROM sales");
        res.json(sales);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "sales controller test" });
};


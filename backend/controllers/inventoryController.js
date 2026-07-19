const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.addBook = async (req, res) => {
    try {
        const { isbn, title, author, price, quantity } = req.body;

        const id = await run(
            `INSERT INTO books (isbn, title, author, price, active)
             VALUES (?, ?, ?, ?, 1)`,
            [isbn, title, author, price]
        );

        await logAction(req.user.user_id, "CREATE", "BOOK", id);

        res.json({ message: "Book added", book_id: id });
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;

        await run(
            `UPDATE books SET quantity = ? WHERE book_id = ?`,
            [quantity, req.params.id]
        );

        await logAction(req.user.user_id, "UPDATE", "BOOK", req.params.id);

        res.json({ message: "Quantity updated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.deactivateBook = async (req, res) => {
    try {
        await run(`UPDATE books SET active = 0 WHERE book_id = ?`, [
            req.params.id,
        ]);

        await logAction(req.user.user_id, "DEACTIVATE", "BOOK", req.params.id);

        res.json({ message: "Book deactivated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.searchInventory = async (req, res) => {
    try {
        const books = await query("SELECT * FROM books WHERE active = 1");
        res.json(books);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "inventory controller test" });
};



const { query, run } = require("../utils/db");
const handleError = require("../middleware/errorHandler");
const { logAction } = require("../utils/audit");

exports.createBook = async (req, res) => {
    try {
        const { isbn, title, author, price } = req.body;

        const id = await run(
            `INSERT INTO books (isbn, title, author, price, active)
             VALUES (?, ?, ?, ?, 1)`,
            [isbn, title, author, price]
        );

        await logAction(req.user.user_id, "CREATE", "BOOK", id);

        res.json({ message: "Book created", book_id: id });
    } catch (err) {
        handleError(res, err);
    }
};

exports.getBooks = async (req, res) => {
    try {
        const books = await query("SELECT * FROM books WHERE active = 1");
        res.json(books);
    } catch (err) {
        handleError(res, err);
    }
};

exports.test = (req, res) => {
    res.json({ message: "books controller test" });
};

exports.getBook = async (req, res) => {
    try {
        const rows = await query(
            "SELECT * FROM books WHERE book_id = ? AND active = 1",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        handleError(res, err);
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { isbn, title, author, price } = req.body;

        await run(
            `UPDATE books
             SET isbn = ?, title = ?, author = ?, price = ?
             WHERE book_id = ?`,
            [isbn, title, author, price, req.params.id]
        );

        await logAction(req.user.user_id, "UPDATE", "BOOK", req.params.id);

        res.json({ message: "Book updated" });
    } catch (err) {
        handleError(res, err);
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await run(
            `UPDATE books SET active = 0 WHERE book_id = ?`,
            [req.params.id]
        );

        await logAction(req.user.user_id, "DELETE", "BOOK", req.params.id);

        res.json({ message: "Book deleted" });
    } catch (err) {
        handleError(res, err);
    }
};

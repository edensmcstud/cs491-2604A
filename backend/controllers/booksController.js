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


// controllers/booksController.js

const { query, run } = require("../utils/db");
const { logAction } = require("../utils/audit");

/**
 * Create a book
 */
exports.createBook = async (req, res, next) => {
    try {
        const { isbn, title, author, price } = req.body;

        if (!isbn || !title || !author || price == null) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await run(
            `INSERT INTO books (isbn, title, author, price, active)
             VALUES (?, ?, ?, ?, 1)`,
            [isbn, title, author, price]
        );

        const bookId = result.lastID;

        await logAction(req.user.user_id, "CREATE", "BOOK", bookId);

        res.json({ message: "Book created", book_id: bookId });
    } catch (err) {
        if (err && err.message && err.message.includes("UNIQUE constraint failed: books.isbn")) {
            return res.status(409).json({ error: "ISBN already exists" });
        }
        next(err);
    }
};

/**
 * Get all ACTIVE books (Employee + Admin)
 */
exports.getBooks = async (req, res, next) => {
    try {
        const books = await query("SELECT * FROM books WHERE active = 1");
        res.json(books);
    } catch (err) {
        next(err);
    }
};

/**
 * Get ALL books (Admin only)
 */
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await query("SELECT * FROM books");
        res.json(books);
    } catch (err) {
        next(err);
    }
};

/**
 * Get a single ACTIVE book
 */
exports.getBook = async (req, res, next) => {
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
        next(err);
    }
};

/**
 * Update book details
 */
exports.updateBook = async (req, res, next) => {
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
        if (err && err.message && err.message.includes("UNIQUE constraint failed: books.isbn")) {
            return res.status(409).json({ error: "ISBN already exists" });
        }
        next(err);
    }
};

/**
 * HARD DELETE book (Admin only)
 */
exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await run(
            `DELETE FROM books WHERE book_id = ?`,
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        await logAction(req.user.user_id, "DELETE", "BOOK", id);

        res.json({ message: "Book deleted" });
    } catch (err) {
        next(err);
    }
};

// controllers/booksController.js

const { query, run } = require("../utils/db");
const { logAction } = require("../utils/audit");

/**
 * Normalize numeric flags (signed, is_collectible)
 */
function normalizeFlag(value) {
    return value ? 1 : 0;
}

/**
 * Normalize price to 2 decimals
 */
function normalizePrice(price) {
    const num = Number(price);
    if (isNaN(num)) return null;
    return Math.round(num * 100) / 100;
}

/**
 * Normalize publication year
 */
function normalizeYear(year) {
    if (!year) return null;
    const num = Number(year);
    if (isNaN(num) || !Number.isInteger(num)) return null;
    return num;
}

/**
 * Normalize text fields (trim empty → null)
 */
function normalizeText(value) {
    if (!value) return null;
    const trimmed = String(value).trim();
    return trimmed.length === 0 ? null : trimmed;
}

/**
 * Create a book
 */
exports.createBook = async (req, res, next) => {
    try {
        const {
            isbn,
            title,
            author,
            publisher,
            category,
            price,
            description,
            publication_year,
            condition,
            edition,
            binding,
            signed,
            provenance,
            is_collectible
        } = req.body;

        // Required fields
        if (!title || price == null) {
            return res.status(400).json({ error: "Title and price are required." });
        }

        // Normalize fields
        const normalizedPrice = normalizePrice(price);
        if (normalizedPrice == null) {
            return res.status(400).json({ error: "Price must be numeric." });
        }

        const normalizedYear = normalizeYear(publication_year);
        const signedVal = normalizeFlag(signed);
        const collectibleVal = normalizeFlag(is_collectible);

        const result = await run(
            `INSERT INTO books (
                isbn, title, author, publisher, category, price,
                description, publication_year, condition, edition,
                binding, signed, provenance, is_collectible, active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [
                normalizeText(isbn),
                normalizeText(title),
                normalizeText(author),
                normalizeText(publisher),
                normalizeText(category),
                normalizedPrice,
                normalizeText(description),
                normalizedYear,
                normalizeText(condition),
                normalizeText(edition),
                normalizeText(binding),
                signedVal,
                normalizeText(provenance),
                collectibleVal
            ]
        );

        const bookId = result.lastID;

        // AUTO‑INITIALIZE INVENTORY
        const qty = collectibleVal === 1 ? 1 : 0;
        const reorderLevel = collectibleVal === 1 ? 0 : 0;
        const reorderQty = collectibleVal === 1 ? 0 : 0;

        await run(
            `INSERT INTO inventory 
                (book_id, quantity_on_hand, quantity_reserved, reorder_level, reorder_quantity)
             VALUES (?, ?, 0, ?, ?)`,
            [bookId, qty, reorderLevel, reorderQty]
        );

        await logAction(req.user.user_id, "CREATE", "BOOK", bookId);

        res.json({ message: "Book created", book_id: bookId });

    } catch (err) {
        if (err?.message?.includes("UNIQUE constraint failed: books.isbn")) {
            return res.status(409).json({ error: "ISBN already exists" });
        }
        next(err);
    }
};

/**
 * Get all ACTIVE books
 * - Customer: only active + in-stock + exact available quantity
 * - Employee/Admin: full inventory details
 */
exports.getBooks = async (req, res, next) => {
    try {
        const isCustomer = req.user.roles.includes("Customer");

        let sql;

        if (isCustomer) {
            sql = `
                SELECT 
                    b.book_id,
                    b.isbn,
                    b.title,
                    b.author,
                    b.publisher,
                    b.category,
                    b.price,
                    b.description,
                    b.publication_year,
                    b.condition,
                    b.edition,
                    b.binding,
                    b.signed,
                    b.provenance,
                    b.is_collectible,
                    i.quantity_on_hand AS available_quantity
                FROM books b
                JOIN inventory i ON b.book_id = i.book_id
                WHERE b.active = 1
                  AND i.quantity_on_hand > 0
                ORDER BY b.title ASC
            `;
        } else {
            sql = `
                SELECT 
                    b.*,
                    i.inventory_id,
                    i.quantity_on_hand,
                    i.quantity_reserved,
                    i.reorder_level,
                    i.reorder_quantity
                FROM books b
                LEFT JOIN inventory i ON b.book_id = i.book_id
                WHERE b.active = 1
                ORDER BY b.title ASC
            `;
        }

        const rows = await query(sql);
        res.json(rows);

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
        const isCustomer = req.user.roles.includes("Customer");
        const bookId = req.params.id;

        let sql;

        if (isCustomer) {
            sql = `
                SELECT 
                    b.book_id,
                    b.isbn,
                    b.title,
                    b.author,
                    b.publisher,
                    b.category,
                    b.price,
                    b.description,
                    b.publication_year,
                    b.condition,
                    b.edition,
                    b.binding,
                    b.signed,
                    b.provenance,
                    b.is_collectible,
                    i.quantity_on_hand AS available_quantity
                FROM books b
                JOIN inventory i ON b.book_id = i.book_id
                WHERE b.book_id = ?
                  AND b.active = 1
                  AND i.quantity_on_hand > 0
            `;
        } else {
            sql = `
                SELECT 
                    b.*,
                    i.quantity_on_hand,
                    i.quantity_reserved,
                    i.reorder_level,
                    i.reorder_quantity
                FROM books b
                LEFT JOIN inventory i ON b.book_id = i.book_id
                WHERE b.book_id = ?
            `;
        }

        const rows = await query(sql, [bookId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }

        res.json(rows[0]);

    } catch (err) {
        next(err);
    }
};
/**
 * Get all books with their inventory details
 */
exports.getBooksWithInventory = async (req, res) => {
    try {
        const rows = await query(`
            SELECT 
                b.book_id,
                b.isbn,
                b.title,
                b.author,
                b.publisher,
                b.category,
                b.price,
                b.description,
                b.publication_year,
                b.is_collectible,
                i.inventory_id,
                i.quantity_on_hand,
                i.quantity_reserved,
                (i.quantity_on_hand - i.quantity_reserved) AS available_quantity
            FROM books b
            JOIN inventory i ON i.book_id = b.book_id
        `);

        res.json(rows);
    } catch (err) {
        handleError(res, err);
    }
};


/**
 * Update book details
 */
exports.updateBook = async (req, res, next) => {
    try {
        const {
            isbn,
            title,
            author,
            publisher,
            category,
            price,
            description,
            publication_year,
            condition,
            edition,
            binding,
            signed,
            provenance,
            is_collectible
        } = req.body;

        const normalizedPrice = normalizePrice(price);
        if (normalizedPrice == null) {
            return res.status(400).json({ error: "Price must be numeric." });
        }

        const normalizedYear = normalizeYear(publication_year);
        const signedVal = normalizeFlag(signed);
        const collectibleVal = normalizeFlag(is_collectible);

        await run(
            `UPDATE books SET
                isbn = ?, title = ?, author = ?, publisher = ?, category = ?, price = ?,
                description = ?, publication_year = ?, condition = ?, edition = ?,
                binding = ?, signed = ?, provenance = ?, is_collectible = ?
             WHERE book_id = ?`,
            [
                normalizeText(isbn),
                normalizeText(title),
                normalizeText(author),
                normalizeText(publisher),
                normalizeText(category),
                normalizedPrice,
                normalizeText(description),
                normalizedYear,
                normalizeText(condition),
                normalizeText(edition),
                normalizeText(binding),
                signedVal,
                normalizeText(provenance),
                collectibleVal,
                req.params.id
            ]
        );

        // Update inventory rules for collectible books
        if (collectibleVal === 1) {
            await run(
                `UPDATE inventory SET 
                    quantity_on_hand = 1,
                    reorder_level = 0,
                    reorder_quantity = 0
                 WHERE book_id = ?`,
                [req.params.id]
            );
        }

        await logAction(req.user.user_id, "UPDATE", "BOOK", req.params.id);

        res.json({ message: "Book updated" });

    } catch (err) {
        if (err?.message?.includes("UNIQUE constraint failed: books.isbn")) {
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


/**
 * Search books by title or author — WITH INVENTORY FIELDS
 */
exports.searchBooks = async (req, res) => {
    try {
        const q = req.query.q?.trim();

        if (!q) {
            return res.json([]);
        }

        const rows = await query(
            `SELECT 
                b.book_id,
                b.isbn,
                b.title,
                b.author,
                b.publisher,
                b.category,
                b.price,
                b.description,
                b.publication_year,
                b.is_collectible,

                i.inventory_id,
                i.quantity_on_hand,
                i.quantity_reserved,
                (i.quantity_on_hand - i.quantity_reserved) AS available_quantity

             FROM books b
             JOIN inventory i ON i.book_id = b.book_id

             WHERE b.title LIKE ?
                OR b.author LIKE ?`,
            [`%${q}%`, `%${q}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error("BOOK SEARCH ERROR:", err);
        res.status(500).json({ error: "Failed to search books" });
    }
};


const axios = require("axios");

/**
 * ISBN Lookup Controller
 * - Fetches metadata from OpenLibrary
 * - Normalizes fields to match your schema
 * - Does NOT write to the database
 */
exports.lookupISBN = async (req, res, next) => {
    try {
        const isbn = req.params.isbn?.trim();

        if (!isbn) {
            return res.status(400).json({ error: "ISBN is required." });
        }

        // OpenLibrary API URL
        const url = `https://openlibrary.org/isbn/${isbn}.json`;

        let bookData;
        try {
            const response = await axios.get(url);
            bookData = response.data;
        } catch (err) {
            return res.status(404).json({ error: "No metadata found for this ISBN." });
        }

        // Normalize fields
        const title = bookData.title || null;
        const publishYear = bookData.publish_date
            ? parseInt(bookData.publish_date)
            : null;

        // Fetch author name if available
        let authorName = null;
        if (bookData.authors && bookData.authors.length > 0) {
            try {
                const authorUrl = `https://openlibrary.org${bookData.authors[0].key}.json`;
                const authorResp = await axios.get(authorUrl);
                authorName = authorResp.data.name || null;
            } catch {
                authorName = null;
            }
        }

        // Fetch description (OpenLibrary returns either string or object)
        let description = null;
        if (bookData.description) {
            if (typeof bookData.description === "string") {
                description = bookData.description;
            } else if (bookData.description.value) {
                description = bookData.description.value;
            }
        }

        // Category/subjects (optional)
        let category = null;
        if (bookData.subjects && bookData.subjects.length > 0) {
            category = bookData.subjects[0]; // pick first subject
        }

        // Publisher (optional)
        let publisher = null;
        if (bookData.publishers && bookData.publishers.length > 0) {
            publisher = bookData.publishers[0];
        }

        // Build normalized response
        const normalized = {
            isbn,
            title,
            author: authorName,
            publisher,
            category,
            description,
            publication_year: publishYear
        };

        res.json(normalized);

    } catch (err) {
        next(err);
    }
};

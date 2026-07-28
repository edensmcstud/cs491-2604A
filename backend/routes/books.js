const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");
const controller = require("../controllers/booksController");

// All book routes require authentication
router.use(auth);

// ===============================
// ADMIN-ONLY: MUST COME FIRST
// ===============================

// Get ALL books (active + inactive)
router.get(
    "/all",
    requirePermission("books", "update"), // FIXED: restrict to Employee + Admin
    controller.getAllBooks
);


// Create a book
router.post(
    "/",
    requirePermission("books", "create"),
    controller.createBook
);

// Lookup a book by ISBN (for creating a new book)
router.get(
    "/lookup/:isbn",
    requirePermission("books", "create"),
    controller.lookupISBN
);

// Update a book
router.put(
    "/:id",
    requirePermission("books", "update"),
    controller.updateBook
);

// Hard delete a book
router.delete(
    "/:id",
    requirePermission("books", "delete"),
    controller.deleteBook
);

// ===============================
// EMPLOYEE + ADMIN (AND CUSTOMER FOR READ)
// ===============================

// Get all ACTIVE books
router.get(
    "/",
    requirePermission("books", "read"),
    controller.getBooks
);

// Get single ACTIVE book
router.get(
    "/:id",
    requirePermission("books", "read"),
    controller.getBook
);

module.exports = router;

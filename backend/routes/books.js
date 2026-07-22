const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const controller = require("../controllers/booksController");

// All book routes require authentication
router.use(auth);

// ===============================
// ADMIN-ONLY: MUST COME FIRST
// ===============================

// Get ALL books (active + inactive)
router.get("/all", requireRole("Admin"), controller.getAllBooks);

// Create a book
router.post("/", requireRole("Admin"), controller.createBook);

// Update a book
router.put("/:id", requireRole("Admin"), controller.updateBook);

// Hard delete a book
router.delete("/:id", requireRole("Admin"), controller.deleteBook);

// ===============================
// EMPLOYEE + ADMIN
// ===============================

// Get all ACTIVE books
router.get("/", requireRole("Employee", "Admin"), controller.getBooks);

// Get single ACTIVE book
router.get("/:id", requireRole("Employee", "Admin"), controller.getBook);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/booksController");

// GET all books
router.get("/", auth, controller.getBooks);

// GET single book
router.get("/:id", auth, controller.getBook);

// CREATE book
router.post("/", auth, controller.createBook);

// UPDATE book
router.put("/:id", auth, controller.updateBook);

// DELETE book (soft delete)
router.delete("/:id", auth, controller.deleteBook);

module.exports = router;

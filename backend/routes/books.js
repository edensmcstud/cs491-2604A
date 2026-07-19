const express = require('express');
const controller = require('../controllers/booksController');
const router = express.Router();

// Add a new book (INV‑S01)
router.post('/', controller.addBook); // TODO Sprint 1

// List all books (INV‑S03)
router.get('/', controller.listBooks); // TODO Sprint 1

// Update book quantity (INV‑S04)
router.put('/:id/quantity', controller.updateQuantity); // TODO Sprint 1

// Remove or deactivate a book (INV‑S02)
router.delete('/:id', controller.removeBook); // TODO Sprint 1

module.exports = router;

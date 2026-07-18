console.log("books route file loaded");

const express = require('express');
const router = express.Router();

// Import the correct controller for THIS route
const controller = require('../controllers/booksController');

// Main endpoint for this domain
router.get('/', controller.getBooks);

// Diagnostic endpoint (Phase 1 requirement)
router.get('/test', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;

// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = require('./database/connection');


// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});


app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            console.error("SQL Error:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


console.log("Server.js loaded");


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


const usersRoute = require('./routes/users');
app.use('/api/users', require('./routes/users'));
console.log("Mounted route:", "/users");

app.use('/api/auth', require('./routes/auth'));
console.log("Mounted route:", "/auth");

app.use('/api/books', require('./routes/books'));
console.log("Mounted route:", "/books");

app.use('/api/inventory', require('./routes/inventory'));
console.log("Mounted route:", "/inventory");

app.use('/api/sales', require('./routes/sales'));
console.log("Mounted route:", "/sales");

app.use('/api/orders', require('./routes/orders'));
console.log("Mounted route:", "/orders");

app.use('/api/supplierOrders', require('./routes/supplierOrders'));
console.log("Mounted route:", "/supplierOrders");

app.use('/api/reports', require('./routes/reports'));
console.log("Mounted route:", "/reports");

app.use('/api/audit', require('./routes/audit'));
console.log("Mounted route:", "/audit");

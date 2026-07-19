// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');

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

// === Sprint 1 Routes ===
app.use('/api/users', require('./routes/users'));
console.log("Mounted route:", "/api/users");

app.use('/api/auth', require('./routes/auth'));
console.log("Mounted route:", "/api/auth");

app.use('/api/books', require('./routes/books'));
console.log("Mounted route:", "/api/books");

app.use('/api/inventory', require('./routes/inventory'));
console.log("Mounted route:", "/api/inventory");

app.use('/api/sales', require('./routes/sales'));
console.log("Mounted route:", "/api/sales");

// === Sprint 2 Routes ===
app.use('/api/customer', require('./routes/customerAuth'));
console.log("Mounted route:", "/api/customer");

app.use('/api/orders', require('./routes/orders'));
console.log("Mounted route:", "/api/orders");

app.use('/api/supplierOrders', require('./routes/supplierOrders'));
console.log("Mounted route:", "/api/supplierOrders");

app.use('/api/reports', require('./routes/reports'));
console.log("Mounted route:", "/api/reports");

app.use('/api/audit', require('./routes/audit'));
console.log("Mounted route:", "/api/audit");

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ===============================
// Core Middleware (MUST COME FIRST)
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug body logger (MUST COME BEFORE ROUTES)
app.use((req, res, next) => {
    console.log("BODY RECEIVED:", req.body);
    next();
});

// ===============================
// Database connection
// ===============================
const db = require('./database/connection');

// Diagnostic test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running' });
});

// ===============================
// Route Mounting (ALL ROUTES)
// ===============================

// Employee CRUD
app.use('/api/users', require('./routes/users'));

// Employee Auth
app.use('/api/auth', require('./routes/auth'));

// Book CRUD
app.use('/api/books', require('./routes/books'));

// Inventory Management
app.use('/api/inventory', require('./routes/inventory'));

// Sales
app.use('/api/sales', require('./routes/sales'));

// Supplier Orders
app.use('/api/supplierOrders', require('./routes/supplierOrders'));

// Suppliers
app.use('/api/suppliers', require('./routes/suppliers'));

// Reports
app.use('/api/reports', require('./routes/reports'));

// Role Management
app.use('/api/roles', require('./routes/roles'));

// Audit Logs
app.use('/api/audit', require('./routes/audit'));

// Backup / Restore
app.use('/api/backup', require('./routes/backup'));

const testRoutes = require("./routes/testRoutes");
app.use("/test", testRoutes);

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

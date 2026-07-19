const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Load and run schema
const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
    if (err) {
        console.error('Failed to initialize database schema:', err);
    } else {
        console.log('Database schema initialized');
    }
});

module.exports = db;

// TODO Sprint 1:
// Create 'books' table if it does not exist

// TODO Sprint 1:
// Create 'sales' table if it does not exist

// TODO Sprint 2:
// Create 'customers' table if it does not exist

// TODO Sprint 2:
// Create 'orders' table if it does not exist

// TODO Sprint 2:
// Create 'supplierOrders' table if it does not exist

// TODO Sprint 2:
// Create 'roles' table if it does not exist

// TODO Sprint 2:
// Create 'auditLogs' table if it does not exist



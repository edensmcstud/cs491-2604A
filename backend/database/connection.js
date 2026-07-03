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

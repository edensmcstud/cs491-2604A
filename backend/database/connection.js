const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Load schema file
const schema = fs.readFileSync(schemaPath, "utf8");

// Check if ANY tables exist
db.get(
    "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table'",
    (err, row) => {
        if (err) {
            console.error("Failed to check DB state:", err);
            return;
        }

        if (row.count === 0) {
            console.log("Database is empty — initializing schema...");
            db.exec(schema, (err) => {
                if (err) {
                    console.error("Failed to initialize database schema:");
                    console.error(err.message);
                } else {
                    console.log("Database schema initialized");
                }
            });
        } else {
            console.log("Database schema already present");
        }
    }
);

module.exports = db;

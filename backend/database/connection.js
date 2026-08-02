const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Enable WAL mode for safer concurrent writes
db.exec("PRAGMA journal_mode = WAL;", (err) => {
    if (err) {
        console.error("Failed to enable WAL mode:", err.message);
    }
});

// Load schema file
const schema = fs.readFileSync(schemaPath, "utf8");

// Repair older databases where a Customer-role user is missing the
// customer profile required for carts and orders.
function ensureCustomerProfiles() {
    db.run(
        `INSERT OR IGNORE INTO customers (user_id)
         SELECT DISTINCT ur.user_id
         FROM user_roles AS ur
         JOIN roles AS r ON r.role_id = ur.role_id
         WHERE r.role_name = 'Customer'`,
        (err) => {
            if (err) {
                console.error("Failed to ensure customer profiles:", err.message);
            } else {
                console.log("Customer profiles ensured");
            }
        }
    );
}

// Check if user-defined tables exist (ignore SQLite internal tables)
db.get(
    `SELECT COUNT(*) AS count
     FROM sqlite_master
     WHERE type='table'
       AND name NOT LIKE 'sqlite_%'`,
    (err, row) => {
        if (err) {
            console.error("Failed to check DB state:", err);
            return;
        }

        if (row.count === 0) {
            console.log("Database is empty — initializing schema...");
            db.exec(schema, async (err) => {
                if (err) {
                    console.error("Failed to initialize database schema:");
                    console.error(err.message);
                } else {
                    console.log("Database schema initialized");

                    // Run RBAC bootstrap
                    const bootstrapRBAC = require("./bootstrapRBAC");
                    await bootstrapRBAC(db);

                    ensureCustomerProfiles();

                    console.log("RBAC bootstrap complete.");
                }
            });
        }
 else {
            console.log("Database schema already present");
            ensureCustomerProfiles();
        }
    }
);

module.exports = db;

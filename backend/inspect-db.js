const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database", "database.sqlite");
console.log("Opening DB:", dbPath);

const db = new sqlite3.Database(dbPath);

function showTable(name) {
    return new Promise((resolve) => {
        console.log(`\n=== ${name.toUpperCase()} ===`);
        db.all(`SELECT * FROM ${name}`, [], (err, rows) => {
            if (err) {
                console.log("Error:", err.message);
                return resolve();
            }
            console.table(rows);
            resolve();
        });
    });
}

(async () => {
    await showTable("permissions");
    await showTable("roles");
    await showTable("role_permissions");
    await showTable("users");
    await showTable("books");
    await showTable("inventory");
    db.close();
})();

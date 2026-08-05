const { query, run } = require("../utils/db");

async function getColumns(table) {
    const rows = await query(`PRAGMA table_info(${table});`);

    // Normalize rows into objects with a "name" field
    return rows.map(row => {
        if (typeof row === "object" && row.name) {
            return row.name;
        }

        // If row is a string (your DB helper sometimes returns strings)
        if (typeof row === "string") {
            // Extract column name from the string
            // Example row string: "0|sale_id|INTEGER|0||1"
            const parts = row.split("|");
            return parts[1]; // column name is always index 1
        }

        throw new Error("Unexpected PRAGMA row format: " + JSON.stringify(row));
    });
}

async function addColumnIfMissing(table, column, definition) {
    const columns = await getColumns(table);

    if (!columns.includes(column)) {
        console.log(`Adding column ${column} to ${table}...`);
        await run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
    } else {
        console.log(`Column ${column} already exists in ${table}.`);
    }
}

async function migrate() {
    try {
        console.log("Checking sales table...");

        await addColumnIfMissing("sales", "customer_id", "INTEGER NULL");
        await addColumnIfMissing("sales", "employee_id", "INTEGER NULL");
        await addColumnIfMissing("sales", "sale_source", "TEXT NOT NULL DEFAULT 'POS'");
        await addColumnIfMissing("sales", "fulfillment_type", "TEXT");
        await addColumnIfMissing("sales", "notes", "TEXT");
        await addColumnIfMissing("sales", "status", "TEXT NOT NULL DEFAULT 'Completed'");

        console.log("Migration complete.");
        process.exit(0);

    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();

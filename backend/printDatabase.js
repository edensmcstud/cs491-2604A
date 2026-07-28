const { query } = require("./utils/db");

(async () => {
    try {
        console.log("=== FULL DATABASE DUMP ===\n");

        // Get all table names
        const tables = await query(`
            SELECT name 
            FROM sqlite_master 
            WHERE type='table' 
              AND name NOT LIKE 'sqlite_%'
            ORDER BY name;
        `);

        if (tables.length === 0) {
            console.log("No tables found.");
            process.exit(0);
        }

        for (const t of tables) {
            const tableName = t.name;
            console.log(`\n--- TABLE: ${tableName} ---`);

            // Fetch all rows
            const rows = await query(`SELECT * FROM ${tableName}`);

            if (rows.length === 0) {
                console.log("(empty)");
                continue;
            }

            // Pretty print each row
            rows.forEach((row, idx) => {
                console.log(`\nRow ${idx + 1}:`);
                console.log(JSON.stringify(row, null, 4));
            });
        }

        console.log("\n=== DATABASE DUMP COMPLETE ===");
        process.exit(0);

    } catch (err) {
        console.error("Error dumping database:", err);
        process.exit(1);
    }
})();

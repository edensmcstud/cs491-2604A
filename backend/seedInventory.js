const { run, query } = require("./utils/db");

(async () => {
    try {
        console.log("=== Seeding Inventory ===");

        // Get all books
        const books = await query("SELECT book_id FROM books");

        if (books.length === 0) {
            console.log("No books found. Seed books first.");
            process.exit(0);
        }

        for (const b of books) {
            await run(
                `INSERT OR IGNORE INTO inventory (
                    book_id,
                    quantity_on_hand,
                    quantity_reserved,
                    reorder_level,
                    reorder_quantity
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    b.book_id,
                    10, // quantity_on_hand
                    0,  // quantity_reserved
                    2,  // reorder_level
                    5   // reorder_quantity
                ]
            );

            console.log(`Created inventory for book_id ${b.book_id}`);
        }

        console.log("=== Inventory Seeding Complete ===");
        process.exit(0);

    } catch (err) {
        console.error("Error seeding inventory:", err);
        process.exit(1);
    }
})();

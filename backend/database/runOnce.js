const { query, run } = require("../utils/db");

(async () => {
    console.log("=== Fixing Reservation for Book 4 ===");

    const orderId = 1; // adjust if needed

    // Get ordered quantity for book 4
    const rows = await query(`
        SELECT coi.quantity AS ordered_quantity
        FROM customer_order_items coi
        WHERE coi.order_id = ?
          AND coi.book_id = 4
    `, [orderId]);

    if (rows.length === 0) {
        console.log("No order items found for book 4.");
        return;
    }

    const orderedQty = rows[0].ordered_quantity;

    console.log(`Ordered quantity for book 4: ${orderedQty}`);

    // Apply fix
    await run(`
        UPDATE inventory
        SET quantity_reserved = ?
        WHERE book_id = 4
    `, [orderedQty]);

    console.log("Reservation updated successfully.");

    // Verify
    const verify = await query(`
        SELECT book_id, quantity_on_hand, quantity_reserved
        FROM inventory
        WHERE book_id = 4
    `);

    console.log("=== Updated Inventory Row ===");
    console.table(verify);

    console.log("=== Fix Complete ===");
})();

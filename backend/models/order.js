exports.getBooks = (req, res) => {
    res.json({ placeholder: "books list" });
};
// TODO Sprint 2:
// Define Order table schema
// Suggested fields:
// id (INTEGER PRIMARY KEY AUTOINCREMENT)
// customerId (INTEGER)
// bookId (INTEGER)
// quantity (INTEGER)
// status (TEXT)  // e.g., 'pending', 'processing', 'shipped', 'cancelled'
// createdAt (DATETIME)

exports.getBooks = (req, res) => {
    res.json({ placeholder: "books list" });
};
// TODO Sprint 1:
// Define Book table schema
// Suggested fields:
// id (INTEGER PRIMARY KEY AUTOINCREMENT)
// title (TEXT)
// author (TEXT)
// isbn (TEXT UNIQUE)
// quantity (INTEGER)
// active (BOOLEAN or INTEGER)
// createdAt (DATETIME)

module.exports.addBook = (req, res) => {
    res.json({
        todo: "Implement add-book logic (Sprint 1)",
        required: [
            "Validate required fields",
            "Validate ISBN format",
            "Insert book into database"
        ]
    });
};

module.exports.listBooks = (req, res) => {
    res.json({
        todo: "Implement list-books logic (Sprint 1)",
        required: [
            "Retrieve books from database",
            "Support search/filter functionality"
        ]
    });
};

module.exports.updateQuantity = (req, res) => {
    res.json({
        todo: "Implement quantity update logic (Sprint 1)",
        required: [
            "Validate quantity value",
            "Update book quantity in database"
        ]
    });
};

module.exports.removeBook = (req, res) => {
    res.json({
        todo: "Implement remove/deactivate logic (Sprint 1)",
        required: [
            "Soft delete or deactivate book",
            "Update database record"
        ]
    });
};

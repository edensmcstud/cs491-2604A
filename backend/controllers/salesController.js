module.exports.createSale = (req, res) => {
    res.json({
        todo: "Implement sales workflow (Sprint 1)",
        required: [
            "Validate sale input",
            "Calculate transaction totals",
            "Update inventory after sale",
            "Insert sale record into database",
            "Generate sale receipt/confirmation"
        ]
    });
};

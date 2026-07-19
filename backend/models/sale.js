class Sale {
    constructor(row) {
        this.id = row.id;
        this.bookId = row.bookId;
        this.quantity = row.quantity;
        this.total = row.total;
        this.createdAt = row.createdAt;
    }
}

module.exports = Sale;

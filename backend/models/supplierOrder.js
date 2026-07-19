class SupplierOrder {
    constructor(row) {
        this.id = row.id;
        this.bookId = row.bookId;
        this.quantity = row.quantity;
        this.status = row.status;
        this.createdAt = row.createdAt;
    }
}

module.exports = SupplierOrder;

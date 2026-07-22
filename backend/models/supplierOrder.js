class SupplierOrder {
    constructor(row) {
        this.id = row.id;
        this.bookId = row.book_id;                 // FIXED
        this.quantity = row.quantity;
        this.status = row.status;
        this.createdAt = row.created_at;           // FIXED
        this.updatedAt = row.updated_at;           // ADDED
        this.supplierId = row.supplier_id;         // ADDED (if applicable)
        this.employeeId = row.employee_id;         // ADDED (if applicable)
        this.isDeleted = row.is_deleted === 1;     // ADDED (normalize boolean)
    }
}

module.exports = SupplierOrder;

class Order {
    constructor(row) {
        this.id = row.id;
        this.customerId = row.customer_id;          // FIXED
        this.status = row.status;
        this.total = row.total;
        this.createdAt = row.created_at;            // FIXED
        this.updatedAt = row.updated_at;            // ADDED
        this.isDeleted = row.is_deleted === 1;      // ADDED (normalize boolean)
        this.employeeId = row.employee_id;          // ADDED (if applicable)
    }
}

module.exports = Order;

class Order {
    constructor(row) {
        this.id = row.id;
        this.customerId = row.customerId;
        this.status = row.status;
        this.total = row.total;
        this.createdAt = row.createdAt;
    }
}

module.exports = Order;

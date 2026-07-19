class Book {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.author = row.author;
        this.price = row.price;
        this.quantity = row.quantity;
        this.active = row.active;
    }
}

module.exports = Book;

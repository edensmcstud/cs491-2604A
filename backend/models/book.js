class Book {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.author = row.author;
        this.price = row.price;
        this.stock = row.stock;     // FIXED
        this.active = row.active;
    }
}

module.exports = Book;

const { run, query } = require("./utils/db");

(async () => {
    try {
        console.log("=== Seeding Books ===");

        // -----------------------------------------
        // Example book seed data
        // -----------------------------------------
        const books = [
            {
                title: "The Pragmatic Programmer",
                author: "Andrew Hunt, David Thomas",
                isbn: "9780201616224",
                genre: "Software Engineering",
                price: 42.99,
                description: "Classic software engineering book focused on craftsmanship and pragmatic thinking."
            },
            {
                title: "Clean Code",
                author: "Robert C. Martin",
                isbn: "9780132350884",
                genre: "Software Engineering",
                price: 37.99,
                description: "A handbook of agile software craftsmanship emphasizing readable, maintainable code."
            },
            {
                title: "Design Patterns",
                author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                isbn: "9780201633610",
                genre: "Computer Science",
                price: 54.99,
                description: "The classic Gang of Four book introducing foundational object‑oriented design patterns."
            },
            {
                title: "Introduction to Algorithms",
                author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                isbn: "9780262033848",
                genre: "Computer Science",
                price: 89.99,
                description: "Comprehensive textbook on algorithms widely used in universities and industry."
            },
            {
                title: "The Phoenix Project",
                author: "Gene Kim, Kevin Behr, George Spafford",
                isbn: "9780988262591",
                genre: "IT / DevOps",
                price: 29.99,
                description: "A novel about IT, DevOps, and business transformation told through a fictional narrative."
            }
        ];

        // -----------------------------------------
        // Insert books
        // -----------------------------------------
        for (const book of books) {
            await run(
                `INSERT OR IGNORE INTO books (title, author, isbn, genre, price, description, is_active, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
                [
                    book.title,
                    book.author,
                    book.isbn,
                    book.genre,
                    book.price,
                    book.description
                ]
            );

            console.log(`Seeded book: ${book.title}`);
        }

        console.log("=== Book Seeding Complete ===");
        process.exit(0);

    } catch (err) {
        console.error("Error seeding books:", err);
        process.exit(1);
    }
})();

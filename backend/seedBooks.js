const { run } = require("./utils/db");

(async () => {
    try {
        console.log("=== Seeding Books (Unified Schema) ===");

        const books = [
            {
                title: "The Pragmatic Programmer",
                author: "Andrew Hunt, David Thomas",
                isbn: "9780201616224",
                publisher: "Addison-Wesley",
                category: "Software Engineering",
                price: 42.99,
                description: "Classic software engineering book focused on craftsmanship and pragmatic thinking.",
                publication_year: 1999
            },
            {
                title: "Clean Code",
                author: "Robert C. Martin",
                isbn: "9780132350884",
                publisher: "Prentice Hall",
                category: "Software Engineering",
                price: 37.99,
                description: "A handbook of agile software craftsmanship emphasizing readable, maintainable code.",
                publication_year: 2008
            },
            {
                title: "Design Patterns",
                author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                isbn: "9780201633610",
                publisher: "Addison-Wesley",
                category: "Computer Science",
                price: 54.99,
                description: "The classic Gang of Four book introducing foundational object‑oriented design patterns.",
                publication_year: 1994
            },
            {
                title: "Introduction to Algorithms",
                author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
                isbn: "9780262033848",
                publisher: "MIT Press",
                category: "Computer Science",
                price: 89.99,
                description: "Comprehensive textbook on algorithms widely used in universities and industry.",
                publication_year: 2009
            },
            {
                title: "The Phoenix Project",
                author: "Gene Kim, Kevin Behr, George Spafford",
                isbn: "9780988262591",
                publisher: "IT Revolution Press",
                category: "IT / DevOps",
                price: 29.99,
                description: "A novel about IT, DevOps, and business transformation told through a fictional narrative.",
                publication_year: 2013
            }
        ];

        for (const b of books) {
            await run(
                `INSERT INTO books (
                    isbn, title, author, publisher, category, price,
                    description, publication_year, condition, edition,
                    binding, signed, provenance, is_collectible, active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
                [
                    b.isbn,
                    b.title,
                    b.author,
                    b.publisher,
                    b.category,
                    b.price,
                    b.description,
                    b.publication_year,
                    null,        // condition
                    null,        // edition
                    null,        // binding
                    0,           // signed
                    null,        // provenance
                    0            // is_collectible
                ]
            );

            console.log(`Seeded book: ${b.title}`);
        }

        console.log("=== Book Seeding Complete ===");
        process.exit(0);

    } catch (err) {
        console.error("Error seeding books:", err);
        process.exit(1);
    }
})();

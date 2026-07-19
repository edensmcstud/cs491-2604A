PRAGMA foreign_keys = ON;

-- ============================
-- USERS (employees + customers)
-- ============================
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================
-- ROLES
-- ============================
CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE
);

-- User ↔ Role mapping
CREATE TABLE user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- ============================
-- BOOKS
-- ============================
CREATE TABLE books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT,
    title TEXT NOT NULL,
    author TEXT,
    publisher TEXT,
    category TEXT,
    price REAL NOT NULL,
    active INTEGER NOT NULL DEFAULT 1
);

-- ============================
-- SALES (employee-driven)
-- ============================
CREATE TABLE sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sale_date TEXT DEFAULT (datetime('now')),
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================
-- CUSTOMERS
-- ============================
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT
);

-- ============================
-- CUSTOMER ORDERS
-- ============================
CREATE TABLE customer_orders (
    customer_order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT DEFAULT (datetime('now')),
    status TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- ============================
-- CUSTOMER ORDER ITEMS
-- ============================
CREATE TABLE customer_order_items (
    customer_order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_order_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,
    FOREIGN KEY (customer_order_id) REFERENCES customer_orders(customer_order_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- ============================
-- SUPPLIER ORDERS (restock)
-- ============================
CREATE TABLE supplier_orders (
    supplier_order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- ============================
-- AUDIT LOGS
-- ============================
CREATE TABLE audit_logs (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================
-- INDEXES (performance)
-- ============================
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_sales_user ON sales(user_id);
CREATE INDEX idx_orders_customer ON customer_orders(customer_id);
CREATE INDEX idx_order_items_order ON customer_order_items(customer_order_id);
CREATE INDEX idx_supplier_orders_book ON supplier_orders(book_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

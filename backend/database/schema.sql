PRAGMA foreign_keys = ON;

-- =====================================================
-- USERS (All authenticated users)
-- Admins, Employees, Customers
-- =====================================================

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);


-- =====================================================
-- ROLES (RBAC)
-- Examples:
-- Admin
-- Employee
-- Customer
-- =====================================================

CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE
);


-- =====================================================
-- USER ROLES
-- Allows users to have one or more roles
-- =====================================================

CREATE TABLE user_roles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON DELETE CASCADE
);


-- =====================================================
-- USER SESSIONS
-- Used by all authenticated users
-- =====================================================

CREATE TABLE sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =====================================================
-- CUSTOMERS
-- Customer-specific information
-- Authentication remains in USERS
-- =====================================================

CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- =====================================================
-- BOOKS
-- Book catalog information
-- =====================================================

CREATE TABLE books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    isbn TEXT UNIQUE,
    title TEXT NOT NULL,
    author TEXT,
    publisher TEXT,
    category TEXT,
    price REAL NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);


-- =====================================================
-- INVENTORY
-- Tracks stock levels
-- =====================================================

CREATE TABLE inventory (
    inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL UNIQUE,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    last_updated TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE
);


-- =====================================================
-- CUSTOMER ORDERS
-- =====================================================

CREATE TABLE customer_orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    order_date TEXT DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'Pending',
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);


-- =====================================================
-- CUSTOMER ORDER ITEMS
-- =====================================================

CREATE TABLE customer_order_items (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES customer_orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(book_id)
);


-- =====================================================
-- SALES
-- Employee completed sales
-- =====================================================

CREATE TABLE sales (
    sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    sale_date TEXT DEFAULT (datetime('now')),
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    total REAL NOT NULL,

    FOREIGN KEY (employee_id)
        REFERENCES users(user_id)
);


-- =====================================================
-- SALES ITEMS
-- Individual books sold
-- =====================================================

CREATE TABLE sale_items (
    sale_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    line_total REAL NOT NULL,

    FOREIGN KEY (sale_id)
        REFERENCES sales(sale_id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(book_id)
);


-- =====================================================
-- SUPPLIERS
-- Manufacturers / Vendors
-- =====================================================

CREATE TABLE suppliers (
    supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_email TEXT,
    phone TEXT
);


-- =====================================================
-- SUPPLIER PURCHASE ORDERS
-- =====================================================

CREATE TABLE supplier_orders (
    supplier_order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Created',
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(supplier_id),

    FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);


-- =====================================================
-- SUPPLIER ORDER ITEMS
-- =====================================================

CREATE TABLE supplier_order_items (
    supplier_order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_order_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost REAL NOT NULL,

    FOREIGN KEY (supplier_order_id)
        REFERENCES supplier_orders(supplier_order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(book_id)
);


-- =====================================================
-- AUDIT LOGS
-- Administrative tracking
-- =====================================================

CREATE TABLE audit_logs (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);

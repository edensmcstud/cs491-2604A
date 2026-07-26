import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";

// Dashboard
import Dashboard from "./pages/Dashboard";

// BOOKS
import BooksList from "./pages/books/BooksList";
import AddBookDetails from "./pages/books/AddBookDetails";
import EditBookDetails from "./pages/books/EditBookDetails";

// INVENTORY
import InventoryList from "./pages/inventory/InventoryList";
import EditInventoryItem from "./pages/inventory/EditInventoryItem";
import UpdateQuantity from "./pages/inventory/UpdateQuantity";
import Inventory from "./pages/inventory/Inventory"; // missing route

// SALES
import Sales from "./pages/sales/Sales";
import AddSale from "./pages/sales/AddSale"; // missing route

// ORDERS
import CustomerOrders from "./pages/orders/CustomerOrders";
import SupplierOrders from "./pages/orders/SupplierOrders";
import AddCustomerOrder from "./pages/orders/AddCustomerOrder"; // missing route
import AddSupplierOrder from "./pages/orders/AddSupplierOrder"; // missing route

// REPORTS
import Reports from "./pages/reports/Reports";
import AuditReports from "./pages/reports/AuditReports"; // missing route
import InventoryReports from "./pages/reports/InventoryReports"; // missing route
import SalesReports from "./pages/reports/SalesReports"; // missing route

// ADMIN
import Administration from "./pages/admin/Administration";
import AuditLog from "./pages/admin/AuditLog";
import PermissionMatrix from "./pages/admin/PermissionMatrix";
import RoleManagement from "./pages/admin/RoleManagement";
import UserAccounts from "./pages/admin/UserAccounts";

// UTILITY
import AccessDenied from "./pages/utility/AccessDenied";
import NotFound from "./pages/utility/NotFound";

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />

            {/* Protected */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />

                {/* Books */}
                <Route path="books" element={<BooksList />} />
                <Route path="books/add" element={<AddBookDetails />} />
                <Route path="books/edit/:id" element={<EditBookDetails />} />

                {/* Inventory */}
                <Route path="inventory" element={<InventoryList />} />
                <Route path="inventory/edit/:id" element={<EditInventoryItem />} />
                <Route path="inventory/update/:id" element={<UpdateQuantity />} />
                <Route path="inventory/view" element={<Inventory />} />

                {/* Sales */}
                <Route path="sales" element={<Sales />} />
                <Route path="sales/add" element={<AddSale />} />

                {/* Orders */}
                <Route path="orders/customers" element={<CustomerOrders />} />
                <Route path="orders/customers/add" element={<AddCustomerOrder />} />
                <Route path="orders/suppliers" element={<SupplierOrders />} />
                <Route path="orders/suppliers/add" element={<AddSupplierOrder />} />

                {/* Reports */}
                <Route path="reports" element={<Reports />} />
                <Route path="reports/audit" element={<AuditReports />} />
                <Route path="reports/inventory" element={<InventoryReports />} />
                <Route path="reports/sales" element={<SalesReports />} />

                {/* Admin */}
                <Route path="admin" element={<Administration />} />
                <Route path="admin/audit-log" element={<AuditLog />} />
                <Route path="admin/permissions" element={<PermissionMatrix />} />
                <Route path="admin/roles" element={<RoleManagement />} />
                <Route path="admin/users" element={<UserAccounts />} />

                {/* Utility */}
                <Route path="access-denied" element={<AccessDenied />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

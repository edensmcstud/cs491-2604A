import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard
import Dashboard from "./pages/Dashboard";

// BOOKS
import BooksList from "./pages/books/BooksList";
import AddBookDetails from "./pages/books/AddBookDetails";
import EditBookDetails from "./pages/books/EditBookDetails";

// CART
import CartPage from "./pages/books/CartPage";

// INVENTORY
import InventoryList from "./pages/inventory/InventoryList";
import EditInventoryItem from "./pages/inventory/EditInventoryItem";
import UpdateQuantity from "./pages/inventory/UpdateQuantity";
import Inventory from "./pages/inventory/Inventory";

// SALES
import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import ReceiptPage from "./pages/sales/ReceiptPage";


// POS (NEW)
import POS from "./pages/pos/POS";

// ORDERS
import CustomerOrders from "./pages/orders/CustomerOrders";
import SupplierOrders from "./pages/orders/SupplierOrders";
import AddCustomerOrder from "./pages/orders/AddCustomerOrder";
import AddSupplierOrder from "./pages/orders/AddSupplierOrder";
import OrderFulfillment from "./pages/orders/OrderFulfillment";
import MyOrders from "./pages/orders/MyOrders";

// REPORTS
import Reports from "./pages/reports/Reports";
import AuditReports from "./pages/reports/AuditReports";
import InventoryReports from "./pages/reports/InventoryReports";
import SalesReports from "./pages/reports/SalesReports";

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
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>

                    {/* Dashboard */}
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Books */}
                    <Route path="books" element={<BooksList />} />
                    <Route path="books/add" element={<AddBookDetails />} />
                    <Route path="books/edit/:id" element={<EditBookDetails />} />

                    {/* Cart */}
                    <Route path="cart" element={<CartPage />} />

                    {/* Inventory */}
                    <Route path="inventory" element={<InventoryList />} />
                    <Route path="inventory/edit/:id" element={<EditInventoryItem />} />
                    <Route path="inventory/update/:id" element={<UpdateQuantity />} />
                    <Route path="inventory/view" element={<Inventory />} />

                    {/* Sales (Sales History) */}
                    <Route path="sales" element={<Sales />} />
                    <Route path="sales/:id" element={<SaleDetails />} />
                    <Route path="sales/:id/receipt" element={<ReceiptPage />} />


                    {/* POS (NEW) */}
                    <Route path="pos" element={<POS />} />

                    {/* Orders */}
                    <Route path="orders/customers" element={<CustomerOrders />} />
                    <Route path="orders/customers/add" element={<AddCustomerOrder />} />
                    <Route path="orders/suppliers" element={<SupplierOrders />} />
                    <Route path="orders/suppliers/add" element={<AddSupplierOrder />} />
                    <Route path="orders/fulfillment" element={<OrderFulfillment />} />
                    <Route path="orders/mine" element={<MyOrders />} />

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
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

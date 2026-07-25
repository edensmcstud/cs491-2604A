import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Login";

// Dashboard
import Dashboard from "./pages/Dashboard";

// BOOKS (metadata)
import BooksList from "./pages/BooksList";
import AddBookDetails from "./pages/AddBookDetails";
import EditBookDetails from "./pages/EditBookDetails";

// INVENTORY (stock)
import InventoryList from "./pages/InventoryList";
import AddInventoryItem from "./pages/AddInventoryItem";
import EditInventoryItem from "./pages/EditInventoryItem";
import UpdateQuantity from "./pages/UpdateQuantity";

// Other modules
import Sales from "./pages/Sales";
import CustomerOrders from "./pages/CustomerOrders";
import SupplierOrders from "./pages/SupplierOrders";
import Reports from "./pages/Reports";
import AuditLog from "./pages/AuditLog";
import RoleManagement from "./pages/RoleManagement";

function App() {
    return (
        <Routes>
            {/* Login does NOT use the layout */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* BOOKS */}
            <Route
                path="/books"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <BooksList />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/books/add"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AddBookDetails />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/books/edit/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <EditBookDetails />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* INVENTORY */}
            <Route
                path="/inventory"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <InventoryList />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/add"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AddInventoryItem />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/edit/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <EditInventoryItem />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/inventory/update/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <UpdateQuantity />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* OTHER MODULES */}
            <Route
                path="/sales"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Sales />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer-orders"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CustomerOrders />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/supplier-orders"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <SupplierOrders />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Reports />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/audit-log"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AuditLog />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/role-management"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <RoleManagement />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Default route → Dashboard */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;

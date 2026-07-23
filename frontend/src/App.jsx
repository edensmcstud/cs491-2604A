import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
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

            {/* Protected pages */}
            <Route
                path="/inventory"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Inventory />
                        </Layout>
                    </ProtectedRoute>
                }
            />

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

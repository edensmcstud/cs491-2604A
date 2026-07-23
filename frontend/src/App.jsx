import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
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

            {/* Protected routes */}
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

            {/* Default route */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <div>Frontend is running</div>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;

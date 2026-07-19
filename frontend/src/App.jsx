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

            {/* Protected example */}
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
                    <Layout>
                        <Sales />
                    </Layout>
                }
            />

            <Route
                path="/customer-orders"
                element={
                    <Layout>
                        <CustomerOrders />
                    </Layout>
                }
            />

            <Route
                path="/supplier-orders"
                element={
                    <Layout>
                        <SupplierOrders />
                    </Layout>
                }
            />

            <Route
                path="/reports"
                element={
                    <Layout>
                        <Reports />
                    </Layout>
                }
            />

            <Route
                path="/audit-log"
                element={
                    <Layout>
                        <AuditLog />
                    </Layout>
                }
            />

            <Route
                path="/role-management"
                element={
                    <Layout>
                        <RoleManagement />
                    </Layout>
                }
            />

            {/* Default route */}
            <Route
                path="/"
                element={
                    <Layout>
                        <div>Frontend is running</div>
                    </Layout>
                }
            />
        </Routes>
    );
}

export default App;

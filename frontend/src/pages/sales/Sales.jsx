import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const money = value => Number(value || 0).toFixed(2);

export default function Sales() {
    const navigate = useNavigate();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSales = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await api.get("/sales");
            setSales(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to load sales history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSales();
    }, [loadSales]);

    return (
        <div className="page sales-history-page">
            <div className="page-heading-row">
                <div>
                    <h1>Sales History</h1>
                    <p className="page-subtitle">Completed POS sales and fulfilled customer orders appear here.</p>
                </div>
                <button className="secondary-button" onClick={loadSales} disabled={loading}>Refresh</button>
            </div>

            {error && <div className="form-error">{error}</div>}
            {loading && <p>Loading sales...</p>}

            {!loading && sales.length === 0 && (
                <div className="empty-state">
                    <h2>No completed sales yet</h2>
                    <p>Customer checkouts remain in Order Fulfillment until an employee fulfills them.</p>
                </div>
            )}

            {!loading && sales.length > 0 && (
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Sale</th>
                                <th>Source</th>
                                <th>Employee</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="numeric-cell">Total</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.sale_id}>
                                    <td><strong>#{sale.sale_id}</strong></td>
                                    <td>{sale.sale_source === "Fulfillment" ? "Customer order" : "POS"}</td>
                                    <td>{sale.employee_username || `User #${sale.employee_id}`}</td>
                                    <td>{sale.sale_date}</td>
                                    <td><span className="status-badge status-healthy">{sale.status || "Completed"}</span></td>
                                    <td className="numeric-cell">${money(sale.total)}</td>
                                    <td className="actions-cell">
                                        <button className="secondary-button" onClick={() => navigate(`/sales/${sale.sale_id}`)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

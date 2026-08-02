import { useState, useEffect } from "react";
import api from "../../api/api";

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [error, setError] = useState("");

    // Load all sales
    useEffect(() => {
        api.get("/sales")
            .then(setSales)
            .catch(() => setError("Failed to load sales"));
    }, []);

    // Load a single sale when clicked
    async function loadSaleDetails(saleId) {
        try {
            const sale = await api.get(`/sales/${saleId}`);
            setSelectedSale(sale);
        } catch (err) {
            console.error(err);
            setError("Failed to load sale details");
        }
    }

    return (
        <div className="page">
            <h1>Sales History</h1>

            {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {error}
                </div>
            )}

            {/* Sales List */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map(s => (
                        <tr
                            key={s.sale_id}
                            style={{ cursor: "pointer" }}
                            onClick={() => loadSaleDetails(s.sale_id)}
                        >
                            <td>{s.sale_id}</td>
                            <td>{s.employee_id}</td>
                            <td>${s.total.toFixed(2)}</td>
                            <td>{s.sale_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Sale Details Panel */}
            {selectedSale && (
                <>
                    {console.log("SELECTED SALE:", selectedSale)}

                    <div
                        style={{
                            marginTop: "30px",
                            padding: "15px",
                            border: "1px solid #ccc",
                            background: "#fafafa"
                        }}
                    >
                        <h2>Sale #{selectedSale.sale_id}</h2>
                        <p><strong>Date:</strong> {selectedSale.sale_date}</p>
                        <p><strong>Employee:</strong> {selectedSale.employee_id}</p>
                        <p><strong>Payment:</strong> {selectedSale.payment_method}</p>

                        <h3>Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSale.items.map(i => (
                                    <tr key={i.sale_item_id}>
                                        <td>{i.title}</td>
                                        <td>{i.quantity}</td>
                                        <td>${i.unit_price.toFixed(2)}</td>
                                        <td>${i.line_total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h3>Totals</h3>
                        <p><strong>Subtotal:</strong> ${selectedSale.subtotal.toFixed(2)}</p>
                        <p><strong>Tax:</strong> ${selectedSale.tax.toFixed(2)}</p>
                        <p><strong>Total:</strong> ${selectedSale.total.toFixed(2)}</p>

                        <button
                            style={{
                                marginTop: "20px",
                                marginRight: "10px",
                                padding: "10px 15px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                            onClick={() => window.location.href = `/sales/${selectedSale.sale_id}/receipt`}
                        >
                            View Receipt
                        </button>

                        <button
                            style={{ marginTop: "20px" }}
                            onClick={() => setSelectedSale(null)}
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

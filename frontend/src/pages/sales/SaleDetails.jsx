import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function SaleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const data = await api.get(`/sales/${id}`);
                setSale(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load sale details");
            }
        }
        load();
    }, [id]);

    if (error) {
        return (
            <div className="page">
                <h1>Sale Details</h1>
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={() => navigate("/sales")}>Back</button>
            </div>
        );
    }

    if (!sale) {
        return (
            <div className="page">
                <h1>Sale Details</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Sale #{sale.sale_id}</h1>

            <button
                onClick={() => navigate("/sales")}
                style={{
                    marginBottom: "20px",
                    padding: "8px 14px",
                    background: "#eee",
                    border: "1px solid #ccc",
                    cursor: "pointer"
                }}
            >
                Back to Sales
            </button>

            <div
                style={{
                    padding: "20px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    borderRadius: "6px",
                    maxWidth: "800px"
                }}
            >
                {/* Summary */}
                <section style={{ marginBottom: "25px" }}>
                    <h2 style={{ marginBottom: "10px" }}>Summary</h2>
                    <div style={{ lineHeight: "1.6" }}>
                        <p><strong>Date:</strong> {sale.sale_date}</p>
                        <p><strong>Employee:</strong> {sale.employee_id}</p>
                        <p><strong>Payment Method:</strong> {sale.payment_method}</p>
                    </div>
                </section>

                {/* Items */}
                <section style={{ marginBottom: "25px" }}>
                    <h2 style={{ marginBottom: "10px" }}>Items</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f5f5f5" }}>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Qty</th>
                                <th style={thStyle}>Unit Price</th>
                                <th style={thStyle}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map(i => (
                                <tr key={i.sale_item_id}>
                                    <td style={tdStyle}>{i.title}</td>
                                    <td style={tdStyle}>{i.quantity}</td>
                                    <td style={tdStyle}>${i.unit_price.toFixed(2)}</td>
                                    <td style={tdStyle}>${i.line_total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Totals */}
                <section>
                    <h2 style={{ marginBottom: "10px" }}>Totals</h2>
                    <div style={{ lineHeight: "1.6" }}>
                        <p><strong>Subtotal:</strong> ${sale.subtotal.toFixed(2)}</p>
                        <p><strong>Tax:</strong> ${sale.tax.toFixed(2)}</p>
                        <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

const thStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
};

const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #eee"
};

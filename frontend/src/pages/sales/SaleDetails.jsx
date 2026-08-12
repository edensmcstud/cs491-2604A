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
                <div className="form-error">{error}</div>
                <button className="primary-button" onClick={() => navigate("/sales")}>
                    Back
                </button>
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
                className="secondary-button"
                style={{ marginBottom: "16px" }}
                onClick={() => navigate("/sales")}
            >
                Back to Sales
            </button>

            <div className="card-soft">
                {/* Summary */}
                <section className="section-block">
                    <h2>Summary</h2>
                    <div className="section-lines">
                        <p><strong>Date:</strong> {sale.sale_date}</p>
                        <p><strong>Employee:</strong> {sale.employee_id}</p>
                        <p><strong>Payment Method:</strong> {sale.payment_method}</p>
                    </div>
                </section>

                {/* Items */}
                <section className="section-block">
                    <h2>Items</h2>

                    <div className="table-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map(i => (
                                    <tr key={i.sale_item_id}>
                                        <td>{i.title}</td>
                                        <td className="numeric-cell">{i.quantity}</td>
                                        <td className="numeric-cell">${i.unit_price.toFixed(2)}</td>
                                        <td className="numeric-cell">${i.line_total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Totals */}
                <section className="section-block">
                    <h2>Totals</h2>
                    <div className="section-lines">
                        <p><strong>Subtotal:</strong> ${sale.subtotal.toFixed(2)}</p>
                        <p><strong>Tax:</strong> ${sale.tax.toFixed(2)}</p>
                        <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

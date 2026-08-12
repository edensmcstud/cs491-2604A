import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

export default function ReceiptPage() {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchReceipt() {
            try {
                const data = await api.get(`/sales/${id}/receipt`);
                setReceipt(data);
            } catch (err) {
                setError("Failed to load receipt");
            } finally {
                setLoading(false);
            }
        }

        fetchReceipt();
    }, [id]);

    if (loading) return <div>Loading receipt…</div>;
    if (error) return <div>{error}</div>;
    if (!receipt) return <div>No receipt found.</div>;

    const {
        sale_id,
        sale_date,
        payment_method,
        sale_source,
        fulfillment_type,
        notes,
        status,
        totals,
        employee,
        customer,
        items
    } = receipt;

    return (
        <div className="receipt-page">
            <h2>Receipt #{sale_id}</h2>
            <hr />

            <section>
                <h3>Sale Details</h3>
                <p><strong>Date:</strong> {sale_date}</p>
                <p><strong>Payment Method:</strong> {payment_method}</p>
                <p><strong>Source:</strong> {sale_source}</p>
                <p><strong>Fulfillment:</strong> {fulfillment_type}</p>
                <p><strong>Status:</strong> {status}</p>
                {notes && <p><strong>Notes:</strong> {notes}</p>}
            </section>

            <hr />

            {employee && (
                <section>
                    <h3>Employee</h3>
                    <p>{employee.username} ({employee.email})</p>
                </section>
            )}

            {customer && (
                <section>
                    <h3>Customer</h3>
                    <p>
                        {customer.first_name} {customer.last_name}<br />
                        {customer.phone}<br />
                        {customer.address}
                    </p>
                </section>
            )}

            <hr />

            <section>
                <h3>Items</h3>
                <table className="receipt-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>ISBN</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.sale_item_id}>
                                <td>{item.title}</td>
                                <td>{item.isbn || "—"}</td>
                                <td className="numeric-cell">{item.quantity}</td>
                                <td className="numeric-cell">${item.unit_price.toFixed(2)}</td>
                                <td className="numeric-cell">${item.line_total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <hr />

            <section>
                <h3>Totals</h3>
                <p><strong>Subtotal:</strong> ${totals.subtotal.toFixed(2)}</p>
                <p><strong>Tax:</strong> ${totals.tax.toFixed(2)}</p>
                <p><strong>Total:</strong> ${totals.total.toFixed(2)}</p>
            </section>

            <hr />

            <button
                className="primary-button"
                onClick={() => window.print()}
            >
                Print Receipt
            </button>
        </div>
    );
}

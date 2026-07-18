export default function CustomerOrders() {
    return (
        <div className="page">
            <h1>Customer Orders</h1>

            <form>
                <label>Customer Name</label>
                <input type="text" />

                <label>ISBN</label>
                <input type="text" />

                <label>Quantity</label>
                <input type="number" />

                <button>Create Order</button>
            </form>

            <h2>Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>ISBN</th>
                        <th>Qty</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

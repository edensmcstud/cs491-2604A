export default function SupplierOrders() {
    return (
        <div className="page">
            <h1>Supplier Orders</h1>

            <form>
                <label>Supplier</label>
                <input type="text" />

                <label>ISBN</label>
                <input type="text" />

                <label>Quantity</label>
                <input type="number" />

                <button>Create Purchase Order</button>
            </form>

            <h2>Incoming Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Supplier</th>
                        <th>ISBN</th>
                        <th>Qty</th>
                        <th>Arrival</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

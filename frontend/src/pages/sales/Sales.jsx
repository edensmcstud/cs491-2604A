export default function Sales() {
    return (
        <div className="page">
            <h1>Sales</h1>

            <form>
                <label>ISBN</label>
                <input type="text" />

                <label>Quantity</label>
                <input type="number" />

                <button>Record Sale</button>
            </form>

            <h2>Recent Sales</h2>
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

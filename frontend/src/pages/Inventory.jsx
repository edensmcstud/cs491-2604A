export default function Inventory() {
    return (
        <div className="page">
            <h1>Inventory</h1>

            <button>Add Book</button>

            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

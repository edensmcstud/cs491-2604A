import { apiGet } from "../api/api";

export default function Inventory() {
    console.log("API GET TEST:", apiGet);
    apiGet("/test")
        .then((res) => console.log("API GET RESULT:", res))
        .catch((err) => console.log("API GET ERROR:", err));

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

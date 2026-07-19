export default function Table({ columns = [], data = [] }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col}>{col}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length}>No data</td>
                    </tr>
                ) : (
                    data.map((row, idx) => (
                        <tr key={idx}>
                            {columns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

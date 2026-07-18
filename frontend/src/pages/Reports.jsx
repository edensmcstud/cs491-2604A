export default function Reports() {
    return (
        <div className="page">
            <h1>Reports</h1>

            <button>Daily Report</button>
            <button>Weekly Report</button>
            <button>Monthly Report</button>

            <h2>Report Output</h2>
            <pre>{/* JSON or text output goes here */}</pre>
        </div>
    );
}

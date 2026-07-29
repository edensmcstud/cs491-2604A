export default function SortHeader({
    label,
    columnKey,
    sortColumn,
    sortDirection,
    onSort
}) {
    const isActive = sortColumn === columnKey;
    const arrow = !isActive ? "" : sortDirection === "asc" ? "▲" : "▼";

    return (
        <button
            type="button"
            className={`books-grid-header-cell sort-header ${isActive ? "active" : ""}`}
            onClick={() => onSort(columnKey)}
        >
            <span>{label}</span>
            {arrow && <span className="sort-arrow">{arrow}</span>}
        </button>
    );
}

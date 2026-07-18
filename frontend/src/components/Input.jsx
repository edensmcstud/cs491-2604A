export default function Input({ label, type = "text", value, onChange }) {
    return (
        <div className="input-group">
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

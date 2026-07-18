export default function Modal({ title, children, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <div className="modal-content">{children}</div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
export default function Button({ children, onClick, type = "button" }) {
    return (
        <button type={type} onClick={onClick} className="btn">
            {children}
        </button>
    );
}

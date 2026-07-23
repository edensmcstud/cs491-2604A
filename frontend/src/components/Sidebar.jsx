import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                </ul>
            </nav>
        </aside>
    );
}

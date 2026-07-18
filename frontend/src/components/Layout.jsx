import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="layout">
            <Header />

            <div className="layout-body">
                <Sidebar />

                <main className="layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

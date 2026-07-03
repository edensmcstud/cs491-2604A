import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<div>Frontend is running</div>} />
        </Routes>
    );
}

export default App;

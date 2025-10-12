
import './App.css'
import { Routes, Route, Navigate, Link } from "react-router-dom";
import ListPage from "./pages/ListPage";
import DetailsPage from "./pages/DetailsPage";

function App() {
   return (
    
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <Link to="/submissions">
        <img
          src="/logo.png"
          alt="Agnieszka Kotlonek – Hipnoterapia w Biznesie"
          style={{ width: 200, marginBottom: 20 }}
        />
      </Link>
      <h1 className="text-3xl font-bold text-emerald-600">Tailwind działa 💫</h1>
    <Routes>
      <Route path="/" element={<Navigate to="/submissions" replace />} />
      <Route path="/submissions" element={<ListPage />} />
      <Route path="/submissions/:submissionId" element={<DetailsPage />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
    </div>
  );
}

export default App

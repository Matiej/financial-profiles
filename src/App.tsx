import "./App.css";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import ListPage from "./pages/ListPage";
import DetailsPage from "./pages/DetailsPage";

function App() {
  return (
    <div className="min-h-dvh bg-white">
      {/* HEADER */}
      <header className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link
            to="https://agnieszkakotlonek.pl/"
            className="block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logo.png"
              alt="Agnieszka Kotlonek – Hipnoterapia w Biznesie"
              className="mx-auto h-64 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/submissions" replace />} />
          <Route path="/submissions" element={<ListPage />} />
          <Route path="/submissions/:submissionId" element={<DetailsPage />} />
          <Route path="*" element={<div className="p-6">404</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

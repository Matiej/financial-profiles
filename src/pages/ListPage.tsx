import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubmissions, fmtDate } from "../api";
import type { SubmissionListItem } from "../types";

export default function ListPage() {
  const [data, setData] = useState<SubmissionListItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null);
      try {
        const list = await fetchSubmissions();
        setData(list);
      } catch (e: unknown) {
        setError(e + "Błąd pobierania listy");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Lista zgłoszeń</h1>
      <p style={{ color: "#666" }}>Klient, Client ID, Submission, Data → „Detale”</p>

      {error && <div style={{ color: "crimson", margin: "12px 0" }}>Błąd: {error}</div>}
      {loading && <div>Ładowanie…</div>}
      {!loading && data && data.length === 0 && <div>Brak zgłoszeń.</div>}

      {!loading && data && data.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr>
              <th style={th}>Klient</th>
              <th style={th}>Client ID</th>
              <th style={th}>Submission</th>
              <th style={th}>Data</th>
              <th style={th}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.submissionId}>
                <td style={td}>{row.clientName || "—"}</td>
                <td style={tdMono}>{row.clientId}</td>
                <td style={tdMono}>{row.submissionId}</td>
                <td style={td}>{fmtDate(row.submissionDate)}</td>
                <td style={td}>
                  <Link to={`/submissions/${row.submissionId}`}>
                    <button color="green">Detale</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" };
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: "8px" };
const tdMono: React.CSSProperties = { ...td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" };

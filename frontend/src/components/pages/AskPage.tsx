import { FormEvent, useEffect, useState } from "react";
import { api, ApiError, NLQueryHistoryItem, NLQueryResult } from "../../api";
import { IconSpark } from "../../icons";

const SUGGESTIONS = [
  "How much did I spend on food last month?",
  "What are my top 5 merchants this year?",
  "Total spent per category in June",
  "How much income did I receive this month?",
];

export function AskPage() {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<NLQueryHistoryItem[]>([]);

  const loadHistory = () => void api.askHistory().then(setHistory).catch(() => {});
  useEffect(loadHistory, []);

  async function ask(text: string) {
    setBusy(true);
    setError(null);
    setResult(null);
    setQuestion(text);
    try {
      setResult(await api.ask(text));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
      loadHistory();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (question.trim()) void ask(question.trim());
  }

  return (
    <div>
      <div className="page-head">
        <h1>Ask AI</h1>
        <span className="crumb">natural language → validated SQL</span>
      </div>

      <div className="grid" style={{ gap: 16 }}>
        <div className="card">
          <form className="ask-box" onSubmit={submit}>
            <input
              placeholder="Ask anything about your spending…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit" disabled={busy || !question.trim()}>
              {busy ? "Thinking…" : "Ask"}
            </button>
          </form>
          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => void ask(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
          {error && <div className="error">{error}</div>}
        </div>

        {result && (
          <div className="card">
            <h2>
              <IconSpark size={13} /> Answer · {result.row_count} row{result.row_count === 1 ? "" : "s"} ·{" "}
              {result.latency_ms} ms
            </h2>
            {result.rows.length === 0 ? (
              <div className="empty">No rows matched.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    {result.columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((value, j) => (
                        <td key={j} className={typeof value === "number" || /^-?\d/.test(String(value)) ? "num" : ""}>
                          {value === null ? "—" : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <label style={{ marginTop: 16 }}>Generated SQL (validated & user-scoped before execution)</label>
            <div className="sql-block">{result.sql}</div>
          </div>
        )}

        {history.length > 0 && (
          <div className="card">
            <h2>Query history</h2>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Status</th>
                  <th>Rows</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.question}</td>
                    <td>
                      <span
                        className={`pill ${
                          item.status === "executed" ? "" : item.status === "rejected" ? "red" : "muted"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="num">{item.row_count ?? "—"}</td>
                    <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(item.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

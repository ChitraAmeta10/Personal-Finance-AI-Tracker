import { FormEvent, useEffect, useState } from "react";
import { api, ApiError, money, NLQueryHistoryItem, NLQueryResult } from "../../api";
import { IconSpark } from "../../icons";

const SUGGESTIONS = [
  "How much did I spend on dining?",
  "What were my top merchants?",
  "How much did I save last month?",
  "What category increased the most?",
];

export function AskPage() {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<NLQueryHistoryItem[]>([]);
  const [showSql, setShowSql] = useState(true);

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
      setError(err instanceof ApiError ? err.message : "AI insights are temporarily unavailable.");
    } finally {
      setBusy(false);
      loadHistory();
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (question.trim()) void ask(question.trim());
  }

  // Synthesize a clean natural language answer summary from result rows
  const answerSummary = result
    ? result.rows.length === 0
      ? "No records matched your specific parameters."
      : result.rows.length === 1 && result.rows[0].length === 1
      ? `Result: ${typeof result.rows[0][0] === "number" ? money(result.rows[0][0] as number) : String(result.rows[0][0])}`
      : `Found ${result.row_count} matching record${result.row_count === 1 ? "" : "s"} across your verified accounts.`
    : null;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="editorial-kicker">NATURAL LANGUAGE SQL</span>
          <h1>Ask your money anything.</h1>
          <p className="editorial-lead" style={{ margin: 0 }}>
            Financial answers without complicated spreadsheets.
          </p>
        </div>
        <span className="crumb">Verified Abstract Syntax Tree</span>
      </div>

      <div className="grid" style={{ gap: 24 }}>
        {/* Large Centered Query Console */}
        <div className="card" style={{ padding: "34px 38px" }}>
          <form className="ask-box" onSubmit={submit}>
            <input
              placeholder="How much did I spend on food last month?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ fontSize: 16, padding: "14px 20px" }}
            />
            <button type="submit" disabled={busy || !question.trim()} style={{ padding: "14px 28px" }}>
              {busy ? "Thinking…" : "Inquire"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              PRESETS:
            </span>
            <div className="suggestions" style={{ margin: 0 }}>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => void ask(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error">{error}</div>}
        </div>

        {/* Natural Language Prominent Result */}
        {result && (
          <div className="card" style={{ borderLeft: "3px solid var(--gold)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconSpark size={16} />
                <span className="editorial-kicker" style={{ margin: 0 }}>ANSWER SUMMARY</span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                Latency: {result.latency_ms} ms · {result.row_count} row{result.row_count === 1 ? "" : "s"}
              </span>
            </div>

            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                fontWeight: 300,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              {answerSummary}
            </div>

            {result.rows.length > 0 && (
              <div style={{ overflowX: "auto", marginBottom: 20 }}>
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
                          <td
                            key={j}
                            className={typeof value === "number" || /^-?\d/.test(String(value)) ? "num" : ""}
                          >
                            {value === null ? "—" : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Expandable Generated SQL & Validation Badge Strip */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <button
                  type="button"
                  className="secondary"
                  style={{ padding: "4px 12px", fontSize: 11 }}
                  onClick={() => setShowSql(!showSql)}
                >
                  {showSql ? "Hide Generated SQL" : "VIEW GENERATED SQL"}
                </button>

                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--text-muted)" }}>
                  <span>✓ Validated</span>
                  <span>✓ Scoped to account</span>
                  <span>✓ SELECT only</span>
                  <span>✓ Row limit applied</span>
                </div>
              </div>

              {showSql && <div className="sql-block">{result.sql}</div>}
            </div>
          </div>
        )}

        {/* Query History */}
        {history.length > 0 && (
          <div className="card">
            <span className="editorial-kicker">HISTORICAL AUDIT</span>
            <h2>Previous Inquiries</h2>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Rows</th>
                  <th style={{ textAlign: "right" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.question}</td>
                    <td>
                      <span
                        className={`pill ${
                          item.status === "executed"
                            ? ""
                            : item.status === "rejected"
                            ? "red"
                            : "muted"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="num">{item.row_count ?? "—"}</td>
                    <td className="num" style={{ color: "var(--text-muted)" }}>
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

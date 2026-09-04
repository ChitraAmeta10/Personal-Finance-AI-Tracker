import { FormEvent, useState } from "react";
import { api, ApiError, money, NLQueryResult } from "../../api";
import { IconSpark } from "../../icons";
import { Page } from "../Shell";
import { seedSamplePortfolio } from "../../sampleData";

const SUGGESTIONS = [
  "How much did I spend on dining?",
  "What were my top merchants?",
  "How much did I save last month?",
  "What category increased the most?",
  "Show my transactions over $100",
];

const DUMMY_RESPONSES: Record<string, NLQueryResult> = {
  dining: {
    question: "How much did I spend on dining?",
    sql: `SELECT merchant, txn_date, amount \nFROM transactions \nWHERE category = 'Dining & Coffee' \n  AND txn_date >= '2026-02-01' \nORDER BY txn_date DESC;`,
    columns: ["Merchant", "Date", "Amount"],
    rows: [
      ["Blue Bottle Coffee", "2026-03-01", "-$6.50"],
      ["Sweetgreen", "2026-02-28", "-$16.40"],
      ["Chipotle Mexican Grill", "2026-02-26", "-$14.20"],
      ["Tartine Bakery", "2026-02-22", "-$18.90"],
    ],
    row_count: 4,
    latency_ms: 14,
  },
  merchants: {
    question: "What were my top merchants?",
    sql: `SELECT merchant, SUM(amount) AS total, COUNT(*) AS count \nFROM transactions \nGROUP BY merchant \nORDER BY total DESC LIMIT 5;`,
    columns: ["Merchant", "Total Spent", "Transactions"],
    rows: [
      ["Trader Joe's", "$480.20", 6],
      ["Delta Air Lines", "$382.40", 1],
      ["Equinox Gym", "$260.00", 1],
      ["Apple Store", "$149.00", 1],
      ["Blue Bottle Coffee", "$84.50", 12],
    ],
    row_count: 5,
    latency_ms: 12,
  },
  save: {
    question: "How much did I save last month?",
    sql: `SELECT month, income, spent, (income - spent) AS net_savings \nFROM monthly_summaries \nORDER BY month DESC LIMIT 1;`,
    columns: ["Month", "Total Income", "Total Spent", "Net Savings"],
    rows: [["February 2026", "$5,400.00", "$4,210.00", "+$1,190.00"]],
    row_count: 1,
    latency_ms: 11,
  },
  category: {
    question: "What category increased the most?",
    sql: `SELECT category, prev_spend, cur_spend, pct_delta \nFROM category_trends \nORDER BY pct_delta DESC LIMIT 1;`,
    columns: ["Category", "Previous Month", "Current Month", "Change"],
    rows: [["Travel & Flights", "$320.00", "$420.00", "+31.2%"]],
    row_count: 1,
    latency_ms: 15,
  },
};

function hasUsableData(result: NLQueryResult): boolean {
  if (result.rows.length === 0) return false;
  return result.rows.some((row) =>
    row.some((val) => val !== null && val !== undefined && val !== "—" && val !== "")
  );
}

function synthesizeSummary(result: NLQueryResult): string {
  if (!hasUsableData(result)) {
    return `No matching records found in your database for "${result.question}".`;
  }

  // Single scalar result (e.g. SUM or COUNT)
  if (result.rows.length === 1 && result.columns.length === 1) {
    const val = result.rows[0][0];
    const col = result.columns[0].replace(/_/g, " ");
    if (typeof val === "number" || (!isNaN(Number(val)) && val !== "")) {
      return `Your calculated ${col} is ${money(Number(val))}.`;
    }
    return `Calculated ${col}: ${val}`;
  }

  // Two columns like [merchant, total]
  if (result.rows.length > 0 && result.columns.length >= 2) {
    const firstRow = result.rows[0];
    const entity = firstRow[0];
    const val = firstRow[1];
    if (val !== null && val !== undefined) {
      return `Top result is ${entity} with ${typeof val === "number" ? money(val) : String(val)} across ${result.row_count} matching records.`;
    }
  }

  return `Found ${result.row_count} verified record${result.row_count === 1 ? "" : "s"} across your linked accounts.`;
}

export function AskPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<NLQueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(true);

  async function ask(text: string) {
    setBusy(true);
    setError(null);
    setResult(null);
    setQuestion(text);
    try {
      const res = await api.ask(text);
      setResult(res);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Query execution failed. Please verify your backend and LLM connection.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (question.trim()) void ask(question.trim());
  }

  function loadSampleDemo(presetKey: string) {
    setError(null);
    const demo = DUMMY_RESPONSES[presetKey] || DUMMY_RESPONSES.dining;
    setResult(demo);
    setQuestion(demo.question);
  }

  async function handleSeedAndRequery() {
    setSeeding(true);
    try {
      await seedSamplePortfolio();
      if (question.trim()) {
        await ask(question.trim());
      } else {
        await ask("How much did I spend on dining?");
      }
    } catch (err) {
      setError("Failed to seed sample statements. Please try importing from the Imports portal.");
    } finally {
      setSeeding(false);
    }
  }

  const isUsable = result ? hasUsableData(result) : false;
  const answerText = result ? synthesizeSummary(result) : null;

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="editorial-kicker">NATURAL LANGUAGE AI ENGINE</span>
          <h1>Ask your money anything.</h1>
          <p className="editorial-lead" style={{ margin: 0 }}>
            Plain English translated to verified, read-only SQL with AST tenant isolation.
          </p>
        </div>
        <span className="crumb">Gemini / Claude SQL Synthesis</span>
      </div>

      <div style={{ display: "grid", gap: 24 }}>
        {/* Large Query Console */}
        <div className="card" style={{ padding: "32px 36px" }}>
          <form className="ask-box" onSubmit={submit}>
            <input
              placeholder="e.g. How much did I spend on dining this month?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit" disabled={busy || !question.trim()}>
              {busy ? "Thinking…" : "Ask FinSight"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-fog-blue)" }}>
              PRESET QUESTIONS:
            </span>
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => void ask(s)} disabled={busy}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ marginTop: 18 }}>
              <div className="error" style={{ marginBottom: 10 }}>{error}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12.5, color: "var(--color-fog-blue)" }}>
                <span>Want to test the interface without a live LLM key?</span>
                <button
                  type="button"
                  onClick={() => loadSampleDemo("dining")}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--color-ash-border)",
                    color: "var(--color-bone-white)",
                    padding: "4px 10px",
                    borderRadius: "var(--radius-buttons)",
                    fontSize: 11.5,
                    cursor: "pointer",
                  }}
                >
                  ✦ View Demo Answer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Query Result Card */}
        {result && (
          <div className="card" style={{ borderLeft: "3px solid var(--color-prism-cyan)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--color-prism-cyan)" }}><IconSpark size={16} /></span>
                <span className="editorial-kicker" style={{ margin: 0, color: "var(--color-prism-cyan)" }}>
                  ANSWER SUMMARY
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-fog-blue)" }}>
                Execution Latency: {result.latency_ms} ms · {result.row_count} row{result.row_count === 1 ? "" : "s"}
              </span>
            </div>

            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--color-bone-white)",
                marginBottom: 18,
                lineHeight: 1.4,
              }}
            >
              {answerText}
            </div>

            {!isUsable && (
              <div
                style={{
                  background: "var(--color-obsidian)",
                  border: "1px solid var(--color-ash-border)",
                  borderRadius: "var(--radius-cards)",
                  padding: "20px 24px",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontSize: 14, color: "var(--color-bone-white)", fontWeight: 500, marginBottom: 6 }}>
                  No transactions recorded for your account yet
                </div>
                <div style={{ fontSize: 13, color: "var(--color-fog-blue)", marginBottom: 16 }}>
                  Ask FinSight translates natural language to SQL queries against your personal database. When your account has no uploaded transactions, queries return 0 rows.
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={handleSeedAndRequery}
                    disabled={seeding}
                    style={{ fontSize: 12, padding: "8px 16px" }}
                  >
                    {seeding ? "Ingesting Sample Statement…" : "✦ Ingest Sample Statement & Re-run"}
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onNavigate?.("imports")}
                    style={{ fontSize: 12, padding: "8px 16px" }}
                  >
                    Go to Statement Ingestion →
                  </button>
                </div>
              </div>
            )}

            {isUsable && result.rows.length > 0 && (
              <div style={{ overflowX: "auto", marginBottom: 20 }}>
                <table>
                  <thead>
                    <tr>
                      {result.columns.map((col) => (
                        <th key={col}>{col.replace(/_/g, " ").toUpperCase()}</th>
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
                            {value === null || value === undefined ? "—" : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Generated SQL Drawer */}
            <div style={{ borderTop: "1px solid var(--color-ash-border)", paddingTop: 16, marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--color-ash-border)",
                    color: "var(--color-bone-white)",
                    padding: "5px 12px",
                    borderRadius: "var(--radius-buttons)",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowSql(!showSql)}
                >
                  {showSql ? "Hide Generated SQL" : "View Generated SQL"}
                </button>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, background: "rgba(42, 255, 42, 0.12)", color: "var(--color-prism-lime)", border: "1px solid rgba(42, 255, 42, 0.3)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                    ✓ Validated AST
                  </span>
                  <span style={{ fontSize: 11, background: "rgba(42, 127, 255, 0.12)", color: "var(--color-prism-cyan)", border: "1px solid rgba(42, 127, 255, 0.3)", padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>
                    ✓ SELECT Only
                  </span>
                  <span style={{ fontSize: 11, background: "var(--color-obsidian)", color: "var(--color-fog-blue)", border: "1px solid var(--color-ash-border)", padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>
                    Tenant Scoped
                  </span>
                </div>
              </div>

              {showSql && (
                <pre
                  style={{
                    background: "var(--color-obsidian)",
                    border: "1px solid var(--color-ash-border)",
                    borderRadius: "var(--radius-cards)",
                    padding: 16,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--color-bone-white)",
                    overflowX: "auto",
                    margin: 0,
                  }}
                >
                  <code>{result.sql}</code>
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

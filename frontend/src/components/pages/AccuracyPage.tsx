import { useEffect, useState } from "react";
import { api, MethodStats } from "../../api";

const SOURCE_META: Record<string, { label: string; color: string }> = {
  rule: { label: "Rules", color: "var(--brand)" },
  llm: { label: "LLM", color: "var(--gold)" },
  manual: { label: "Manual", color: "var(--series-5)" },
  uncategorized: { label: "Uncategorized", color: "var(--other)" },
};

export function AccuracyPage() {
  const [stats, setStats] = useState<MethodStats | null>(null);

  useEffect(() => {
    void api.stats().then(setStats);
  }, []);

  if (!stats) return <div>Loading…</div>;

  const total = stats.transactions_total || 1;
  const sources = Object.entries(stats.by_source);

  return (
    <div>
      <div className="page-head">
        <h1>AI accuracy</h1>
        <span className="crumb">how rules and the LLM compare</span>
      </div>
      <div className="grid" style={{ gap: 16 }}>
        <div className="grid kpi-row">
          <div className="card stat-tile" style={{ ["--accent" as string]: "var(--brand)" }}>
            <span className="label">Transactions categorized</span>
            <div className="value">{stats.transactions_total}</div>
          </div>
          <div className="card stat-tile" style={{ ["--accent" as string]: "var(--gold)" }}>
            <span className="label">Judged by both methods</span>
            <div className="value">{stats.compared}</div>
          </div>
          <div className="card stat-tile" style={{ ["--accent" as string]: "var(--series-5)" }}>
            <span className="label">Rule ↔ LLM agreement</span>
            <div className="value">
              {stats.agreement_rate === null ? "—" : `${(stats.agreement_rate * 100).toFixed(0)}%`}
            </div>
            <div className="sub">
              {stats.agreement_rate === null
                ? "needs transactions judged by both"
                : `${stats.agreements} of ${stats.compared} matched`}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Who decided each transaction</h2>
          {sources.length === 0 ? (
            <div className="empty">Nothing categorized yet.</div>
          ) : (
            sources.map(([source, count]) => {
              const meta = SOURCE_META[source] ?? { label: source, color: "var(--other)" };
              return (
                <div className="break-row" key={source}>
                  <span>
                    <span className="swatch" style={{ background: meta.color }} />
                    {meta.label}
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(count / total) * 100}%`, background: meta.color }} />
                  </div>
                  <span className="count">{count}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="card">
          <h2>How the pipeline works</h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: "72ch" }}>
            Every transaction first passes a zero-cost keyword classifier — unambiguous merchants
            (Netflix, Trader Joe's, payroll) are settled instantly by rules. Anything below the
            confidence threshold is batched to Claude. Both predictions are logged for every
            transaction they touch, which is what makes this page possible: the agreement rate
            above compares the rule's guess against the LLM's on exactly the same transactions.
            If the LLM is unavailable, weak rule matches are used as a fallback so imports never
            stall.
          </p>
        </div>
      </div>
    </div>
  );
}

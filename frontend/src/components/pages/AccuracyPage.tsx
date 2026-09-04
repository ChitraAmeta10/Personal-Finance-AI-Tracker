import { useEffect, useState } from "react";
import { api, MethodStats } from "../../api";

import { Page } from "../Shell";

const SOURCE_META: Record<string, { label: string; color: string }> = {
  rule: { label: "Deterministic Rules", color: "var(--color-prism-cyan)" },
  llm: { label: "Gemini / Claude AI", color: "var(--color-prism-lime)" },
  manual: { label: "Manual User Override", color: "var(--series-5)" },
  uncategorized: { label: "Uncategorized", color: "var(--other)" },
};

export function AccuracyPage(_props: { onNavigate?: (page: Page) => void } = {}) {
  const [stats, setStats] = useState<MethodStats | null>(null);

  useEffect(() => {
    void api.stats().then(setStats);
  }, []);

  if (!stats) {
    return <div className="card empty">Measuring verification pipelines…</div>;
  }

  const total = stats.transactions_total || 1;
  const sources = Object.entries(stats.by_source);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="editorial-kicker">VERIFICATION &amp; TELEMETRY</span>
          <h1>How FinSight thinks.</h1>
          <p className="editorial-lead" style={{ margin: 0 }}>
            Deterministic rule-first architecture. AI is used only where mathematical certainty is absent.
          </p>
        </div>
        <span className="crumb">Dual-Model Audit</span>
      </div>

      <div className="grid" style={{ gap: 24 }}>
        {/* Visual Pipeline Architecture (Rose Family / Editorial Flow) */}
        <div className="card" style={{ padding: "34px 38px" }}>
          <span className="editorial-kicker">EXECUTION LIFECYCLE</span>
          <h2>Deterministic Pipeline Flow</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 10px",
              flexWrap: "wrap",
              gap: 12,
              background: "var(--surface-2)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              marginTop: 14,
            }}
          >
            {[
              { step: "01", name: "TRANSACTION", desc: "Raw CSV Ingest" },
              { step: "02", name: "RULE ENGINE", desc: "Keyword regex <1ms" },
              { step: "03", name: "CONFIDENCE CHECK", desc: "Score threshold" },
              { step: "04", name: "CLAUDE 3.5", desc: "Batched reasoning" },
              { step: "05", name: "VALIDATION", desc: "Schema conformity" },
              { step: "06", name: "FINAL CATEGORY", desc: "Permanent Ledger" },
            ].map((node, i, arr) => (
              <div key={node.step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, color: "var(--gold)", fontStyle: "italic" }}>
                    {node.step}
                  </div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {node.desc}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: "var(--border-strong)", fontSize: 16 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid kpi-row">
          <div className="stat-tile">
            <div className="top">
              <span className="label">TOTAL PROCESSED</span>
            </div>
            <div className="value">{stats.transactions_total}</div>
            <div className="sub">Transactions normalized</div>
          </div>

          <div className="stat-tile">
            <div className="top">
              <span className="label">DUAL-CHECKED</span>
            </div>
            <div className="value">{stats.compared}</div>
            <div className="sub">Judged by rules &amp; LLM</div>
          </div>

          <div className="stat-tile">
            <div className="top">
              <span className="label">AGREEMENT RATE</span>
            </div>
            <div className="value" style={{ color: "var(--brand)" }}>
              {stats.agreement_rate === null ? "—" : `${(stats.agreement_rate * 100).toFixed(0)}%`}
            </div>
            <div className="sub">
              {stats.agreement_rate === null
                ? "Awaiting dual evaluations"
                : `${stats.agreements} of ${stats.compared} concordant`}
            </div>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="card">
          <span className="editorial-kicker">DISPATCH RATIOS</span>
          <h2>Who Decided Each Transaction</h2>
          {sources.length === 0 ? (
            <div className="empty">No categorized transactions on record.</div>
          ) : (
            sources.map(([source, count]) => {
              const meta = SOURCE_META[source] ?? { label: source, color: "var(--other)" };
              const ratio = (count / total) * 100;
              return (
                <div className="break-row" key={source}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    <span className="swatch" style={{ background: meta.color }} />
                    {meta.label}
                  </span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${ratio}%`, background: meta.color }}
                    />
                  </div>
                  <span className="count">
                    {count} ({ratio.toFixed(0)}%)
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Narrative Explanation */}
        <div className="card" style={{ borderLeft: "3px solid var(--gold)" }}>
          <span className="editorial-kicker">DESIGN PHILOSOPHY</span>
          <h2>Why FinSight Does Not Blindly Trust AI</h2>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 14.5, fontWeight: 300 }}>
            Every statement entry first traverses an instant, deterministic keyword and regex dictionary.
            High-volume, unambiguous merchants (such as AWS, Stripe, Netflix, and payroll runs) are classified
            with zero API latency and absolute mathematical reproducibility. Only ambiguous or novel merchant
            strings trigger batched Claude 3.5 Sonnet analysis. By comparing rule outputs with LLM judgments
            across identical records, FinSight maintains a continuous consensus audit trail with zero hallucinatory drift.
          </p>
        </div>
      </div>
    </div>
  );
}

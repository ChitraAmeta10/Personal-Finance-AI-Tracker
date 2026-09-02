import { useState, type FormEvent } from "react";
import { Terminal, Play, CheckCircle2, ShieldCheck, Sparkles, Database } from "lucide-react";

interface QueryPreset {
  id: string;
  label: string;
  query: string;
  sql: string;
  executionMs: number;
  resultSummary: {
    title: string;
    value: string;
    subtext: string;
    rows: Array<{ label: string; amount: string; pct: number }>;
  };
}

const PRESETS: QueryPreset[] = [
  {
    id: "dining",
    label: "🍔 Dining & Groceries",
    query: "How much did I spend on dining and groceries last month?",
    sql: `SELECT c.name AS category, SUM(t.amount) AS total
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = current_user_id()
  AND t.date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND c.name IN ('Food & Dining', 'Groceries')
GROUP BY c.name;`,
    executionMs: 8,
    resultSummary: {
      title: "Total Food & Dining",
      value: "$642.80",
      subtext: "↓ 12.4% vs previous 30-day average",
      rows: [
        { label: "Whole Foods Market", amount: "$318.40", pct: 50 },
        { label: "DoorDash / Caviar", amount: "$184.20", pct: 28 },
        { label: "Local Coffee & Cafes", amount: "$140.20", pct: 22 },
      ],
    },
  },
  {
    id: "recurring",
    label: "🔁 Recurring Subscriptions",
    query: "Identify all recurring software subscriptions and active monthly leaks",
    sql: `SELECT t.merchant_clean, t.amount, COUNT(*) as freq_count
FROM transactions t
WHERE t.user_id = current_user_id()
  AND t.is_recurring = true
  AND t.date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY t.merchant_clean, t.amount
ORDER BY t.amount DESC LIMIT 3;`,
    executionMs: 14,
    resultSummary: {
      title: "Active Subscriptions",
      value: "$89.97 / mo",
      subtext: "3 recurring charges detected across accounts",
      rows: [
        { label: "Claude Pro / Anthropic", amount: "$20.00", pct: 22 },
        { label: "GitHub Copilot Enterprise", amount: "$39.00", pct: 43 },
        { label: "AWS Cloud Services", amount: "$30.97", pct: 35 },
      ],
    },
  },
  {
    id: "cashflow",
    label: "📈 Inflows vs Outflows",
    query: "Compare net cashflow and savings rate for the current billing cycle",
    sql: `SELECT
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS income,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS expenses,
  (1 - (SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) /
   NULLIF(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0))) * 100 AS savings_rate
FROM transactions
WHERE user_id = current_user_id()
  AND date >= DATE_TRUNC('month', CURRENT_DATE);`,
    executionMs: 11,
    resultSummary: {
      title: "Net Savings Rate",
      value: "41.8%",
      subtext: "Net Surplus: +$2,480.00 this month",
      rows: [
        { label: "Gross Inflow (Payroll)", amount: "+$5,930.00", pct: 100 },
        { label: "Living Expenses & Bills", amount: "-$2,810.00", pct: 47 },
        { label: "Discretionary & Invested", amount: "-$640.00", pct: 11 },
      ],
    },
  },
];

export function InteractiveTerminal() {
  const [selectedId, setSelectedId] = useState<string>("dining");
  const [customInput, setCustomInput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const currentPreset = PRESETS.find((p) => p.id === selectedId) || PRESETS[0];

  const handleSelectPreset = (id: string) => {
    setIsExecuting(true);
    setSelectedId(id);
    setCustomInput("");
    setTimeout(() => {
      setIsExecuting(false);
    }, 280);
  };

  const handleRunCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 350);
  };

  return (
    <div className="neural-terminal-card">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="terminal-title">
          <Terminal size={14} className="icon-pulse" />
          <span>FinSight Neural Text-to-SQL Sandbox</span>
        </div>
        <div className="terminal-badge">
          <ShieldCheck size={13} />
          <span>User-Scoped AST Verified</span>
        </div>
      </div>

      <div className="terminal-body">
        {/* Presets Row */}
        <div className="query-preset-chips">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip ${selectedId === preset.id ? "active" : ""}`}
              onClick={() => handleSelectPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input prompt simulation */}
        <form onSubmit={handleRunCustom} className="terminal-prompt-bar">
          <div className="prompt-indicator">
            <Sparkles size={15} className="sparkle-gold" />
          </div>
          <input
            type="text"
            className="terminal-input"
            value={customInput || currentPreset.query}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Ask anything about your finances in plain English..."
          />
          <button type="submit" className="run-button" title="Execute Query">
            <Play size={13} fill="currentColor" />
            <span>Run</span>
          </button>
        </form>

        {/* Dual Screen: SQL translation on Left, Visual Outcome on Right */}
        <div className="terminal-output-grid">
          {/* SQL Pane */}
          <div className="terminal-sql-pane">
            <div className="pane-header">
              <div className="pane-label">
                <Database size={13} />
                <span>Generated Safe SQL (SELECT-Only)</span>
              </div>
              <span className="exec-time">
                {isExecuting ? "Synthesizing..." : `⚡ ${currentPreset.executionMs}ms latency`}
              </span>
            </div>
            <pre className="sql-code-block">
              <code>{currentPreset.sql}</code>
            </pre>
            <div className="security-tag">
              <CheckCircle2 size={12} color="#10b981" />
              <span>Parameterized &bull; Zero prompt-injection vector</span>
            </div>
          </div>

          {/* Interactive Result Card */}
          <div className={`terminal-result-pane ${isExecuting ? "loading-pulse" : ""}`}>
            <div className="pane-header">
              <span className="pane-label">Live Aggregated Insight</span>
              <span className="status-live">● Verified Data</span>
            </div>

            <div className="result-metric-hero">
              <div className="metric-val">{currentPreset.resultSummary.value}</div>
              <div className="metric-sub">{currentPreset.resultSummary.subtext}</div>
            </div>

            <div className="result-breakdown-list">
              {currentPreset.resultSummary.rows.map((row, idx) => (
                <div key={idx} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-name">{row.label}</span>
                    <span className="breakdown-val">{row.amount}</span>
                  </div>
                  <div className="breakdown-track">
                    <div
                      className="breakdown-fill"
                      style={{
                        width: `${row.pct}%`,
                        background:
                          idx === 0
                            ? "var(--brand)"
                            : idx === 1
                            ? "var(--gold)"
                            : "var(--series-1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

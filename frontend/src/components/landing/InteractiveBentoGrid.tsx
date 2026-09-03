import { useState, useRef } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const SPEND_VELOCITY_DATA = [
  { day: "01", spend: 420 },
  { day: "05", spend: 890 },
  { day: "10", spend: 610 },
  { day: "15", spend: 1450 },
  { day: "20", spend: 920 },
  { day: "25", spend: 1820 },
  { day: "30", spend: 1150 },
];

export function InteractiveBentoGrid({ onGetStarted }: { onGetStarted: () => void }) {
  // Bento 1: 3D Tilt State
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setCardTilt({
      x: ((y - cy) / cy) * -12,
      y: ((x - cx) / cx) * 12,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  // Bento 3: Raw Statement Parser Sample
  const [statementSample, setStatementSample] = useState<"chase" | "amex" | "stripe">("chase");

  // Bento 4: SQL Interactive Sandbox
  const [activeQueryIdx, setActiveQueryIdx] = useState(0);
  const QUERIES = [
    {
      q: "Find all recurring SaaS charges over $100 in the last 90 days",
      sql: `SELECT merchant, amount, date, cadence\nFROM transactions\nWHERE category = 'Software & SaaS'\n  AND amount >= 100.00\n  AND cadence = 'MONTHLY'\n  AND date >= NOW() - INTERVAL '90 days'\nORDER BY amount DESC;`,
      time: "0.62ms",
      resultVal: "$1,840.00",
      resultSub: "4 recurring vendors identified",
    },
    {
      q: "What is my net burn velocity compared to last month?",
      sql: `SELECT\n  DATE_TRUNC('month', date) AS month,\n  SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS burn,\n  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS inflows\nFROM transactions\nGROUP BY month\nORDER BY month DESC LIMIT 2;`,
      time: "0.78ms",
      resultVal: "-$4,210.00",
      resultSub: "Burn rate decelerated by 14.2%",
    },
    {
      q: "List non-deductible dining expenses exceeding $50",
      sql: `SELECT date, merchant, amount\nFROM transactions\nWHERE category = 'Dining & Coffee'\n  AND tax_deductible = FALSE\n  AND amount > 50.00\nORDER BY date DESC LIMIT 5;`,
      time: "0.54ms",
      resultVal: "$682.50",
      resultSub: "6 flagged line items",
    },
  ];

  // Bento 5: Yield & Leak Slider
  const [monthlySpend, setMonthlySpend] = useState(6500);
  const potentialSavings = Math.round(monthlySpend * 0.14);
  const annualCompound = Math.round(potentialSavings * 12 * 1.085);

  return (
    <div className="bento-grid-container" data-cursor="INTERACT">
      {/* ============================================================
          BENTO 01: 3D HOLOGRAPHIC QUANTUM CARD (Col Span 2)
          ============================================================ */}
      <div
        ref={cardRef}
        className="bento-card bento-card-hero"
        onMouseMove={handleCardTilt}
        onMouseLeave={() => setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 })}
        style={{
          transform: `perspective(1200px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
          transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Dynamic Specular Sheen */}
        <div
          className="bento-glare"
          style={{
            background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(0, 242, 254, 0.4) 0%, rgba(139, 92, 246, 0.2) 35%, transparent 70%)`,
            opacity: cardTilt.opacity,
          }}
        />

        <div className="bento-hero-media">
          <img
            src="/images/hologram-card.jpg"
            alt="FinSight Quantum Titanium Card"
            className="bento-hero-img"
          />
          <div className="bento-hero-hud-top">
            <span className="hud-pill">
              <span className="hud-dot" />
              <span>AES-256 HARDWARE ENCLAVE</span>
            </span>
            <span className="hud-metric-pill">&lt; 0.001MS ATTESTATION</span>
          </div>
          <div className="bento-hero-hud-bottom">
            <div className="hud-hero-balance">
              <span className="hud-bal-label">VERIFIED LIQUID RESERVE</span>
              <span className="hud-bal-val">$148,250.00</span>
            </div>
            <div className="hud-hero-chip">
              <ShieldCheck size={18} color="var(--fin-cyan)" />
              <span>Multi-Tenant Isolated</span>
            </div>
          </div>
        </div>

        <div className="bento-caption">
          <div className="bento-tag">
            <Cpu size={13} />
            <span>01 / PHYSICAL MONOLITH</span>
          </div>
          <h3 className="bento-title">Quantum Titanium Hardware Monolith</h3>
          <p className="bento-desc">
            Laser-etched aerospace titanium with an integrated cryptographic secure element. No plain-text keys, no cloud leakage.
          </p>
        </div>
      </div>

      {/* ============================================================
          BENTO 02: NEURAL SPEND VELOCITY (Col Span 1)
          ============================================================ */}
      <div className="bento-card bento-card-chart">
        <div className="bento-tag">
          <TrendingUp size={13} />
          <span>02 / REAL-TIME TELEMETRY</span>
        </div>
        <h3 className="bento-title">Spend Velocity Radar</h3>
        <p className="bento-desc">Autonomous cash velocity monitoring with Recharts 2.15 streaming analytics.</p>

        <div className="bento-chart-container">
          <div className="bento-chart-stats">
            <div>
              <span className="chart-stat-k">BURNDOWN VELOCITY</span>
              <span className="chart-stat-v">$1,150 / wk</span>
            </div>
            <span className="chart-stat-delta">+14.2% OPTIMAL</span>
          </div>

          <div style={{ width: "100%", height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPEND_VELOCITY_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: "rgba(3, 7, 18, 0.95)",
                    borderColor: "var(--fin-border-hover)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#FFF",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#00F2FE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-micro-tags">
          <span className="micro-pill">100% Idempotent</span>
          <span className="micro-pill">Zero Hallucination</span>
        </div>
      </div>

      {/* ============================================================
          BENTO 03: CSV INGESTION DECODER (Col Span 1)
          ============================================================ */}
      <div className="bento-card bento-card-ingest">
        <div className="bento-tag">
          <Database size={13} />
          <span>03 / INGESTION LAB</span>
        </div>
        <h3 className="bento-title">Statement Normalizer</h3>
        <p className="bento-desc">Format-agnostic ingestion with cryptographic SHA-256 deduplication.</p>

        <div className="sample-switch-row">
          <button
            type="button"
            className={`sample-pill ${statementSample === "chase" ? "active" : ""}`}
            onClick={() => setStatementSample("chase")}
          >
            Chase Business
          </button>
          <button
            type="button"
            className={`sample-pill ${statementSample === "amex" ? "active" : ""}`}
            onClick={() => setStatementSample("amex")}
          >
            Amex Platinum
          </button>
          <button
            type="button"
            className={`sample-pill ${statementSample === "stripe" ? "active" : ""}`}
            onClick={() => setStatementSample("stripe")}
          >
            Stripe Payouts
          </button>
        </div>

        <div className="ingest-raw-box">
          <span className="ingest-hash-badge">SHA-256 DEDUPLICATED</span>
          <code>
            {statementSample === "chase" && "2026-03-01,POS DEBIT AWS CLOUD SYDNEY,-$324.50"}
            {statementSample === "amex" && "2026-02-28,DELTA AIRLINES ATLANTA GA,-$680.00"}
            {statementSample === "stripe" && "2026-02-27,STRIPE PAYOUT ACC-991823,+$14,250.00"}
          </code>
        </div>

        <div className="ingest-verified-row">
          <CheckCircle2 size={16} color="var(--fin-cyan)" />
          <span className="verified-text">
            Categorized as <strong>{statementSample === "chase" ? "Infrastructure & Cloud" : statementSample === "amex" ? "Corporate Travel" : "Revenue"}</strong> (Confidence 99.8%)
          </span>
        </div>
      </div>

      {/* ============================================================
          BENTO 04: NEURAL TEXT-TO-SQL STUDIO (Col Span 2)
          ============================================================ */}
      <div className="bento-card bento-card-sql">
        <div className="bento-tag">
          <Terminal size={13} />
          <span>04 / ZERO-INJECTION SQL</span>
        </div>
        <h3 className="bento-title">Neural SQL Synthesis Studio</h3>
        <p className="bento-desc">
          Query your multi-million dollar ledger in natural conversational English. Scoped strictly via AST guardrails.
        </p>

        {/* Query Presets */}
        <div className="sql-chips-row">
          {QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              className={`sql-chip ${idx === activeQueryIdx ? "active" : ""}`}
              onClick={() => setActiveQueryIdx(idx)}
            >
              <Search size={12} />
              <span>{q.q}</span>
            </button>
          ))}
        </div>

        {/* SQL Output Box */}
        <div className="sql-viewport-grid">
          <div className="sql-code-pane">
            <div className="sql-pane-top">
              <span className="sql-top-tag">VALIDATED AST // SELECT ONLY</span>
              <span className="sql-exec-time">{QUERIES[activeQueryIdx].time}</span>
            </div>
            <pre className="sql-code-body">
              <code>{QUERIES[activeQueryIdx].sql}</code>
            </pre>
          </div>

          <div className="sql-result-pane">
            <span className="result-k">SYNTHESIZED INSIGHT</span>
            <div className="result-hero-val">{QUERIES[activeQueryIdx].resultVal}</div>
            <div className="result-hero-sub">{QUERIES[activeQueryIdx].resultSub}</div>
            <div className="sql-security-pill">
              <Sparkles size={13} color="var(--fin-cyan)" />
              <span>Claude 3.5 Sonnet AST Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          BENTO 05: CAPITAL YIELD & SAAS LEAK SIMULATOR (Col Span 2)
          ============================================================ */}
      <div className="bento-card bento-card-yield">
        <div className="bento-tag">
          <Zap size={13} />
          <span>05 / CAPITAL YIELD ACCELERATOR</span>
        </div>
        <h3 className="bento-title">Subscription Leak & Compounding Engine</h3>
        <p className="bento-desc">
          Drag your estimated monthly corporate expenses to simulate automated leak recovery and 5-year treasury yield.
        </p>

        <div className="yield-slider-box">
          <div className="slider-header">
            <span className="slider-label">MONTHLY OPERATING EXPENSES</span>
            <span className="slider-val">${monthlySpend.toLocaleString()} / mo</span>
          </div>
          <input
            type="range"
            min="2000"
            max="30000"
            step="500"
            value={monthlySpend}
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="yield-range-bar"
          />
          <div className="slider-marks">
            <span>$2,000 / mo</span>
            <span>$15,000 / mo</span>
            <span>$30,000 / mo</span>
          </div>
        </div>

        <div className="yield-stats-grid">
          <div className="yield-stat-tile">
            <span className="stat-tile-k">DETECTED RECURRING LEAKS</span>
            <span className="stat-tile-val text-cyan">${potentialSavings.toLocaleString()}</span>
            <span className="stat-tile-sub">Average ~14% monthly waste eliminated</span>
          </div>
          <div className="yield-stat-tile">
            <span className="stat-tile-k">5-YR COMPOUNDED TREASURY YIELD</span>
            <span className="stat-tile-val text-white">${annualCompound.toLocaleString()}</span>
            <span className="stat-tile-sub">Reinvested at 8.5% benchmark yield</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          BENTO 06: MULTI-TENANT ARCHITECTURE HUD (Col Span 1)
          ============================================================ */}
      <div className="bento-card bento-card-architecture">
        <div className="bento-tag">
          <Layers size={13} />
          <span>06 / SYSTEM ARCHITECTURE</span>
        </div>
        <h3 className="bento-title">Polyglot Persistence</h3>
        <p className="bento-desc">High-throughput financial ledger pipeline.</p>

        <div className="arch-pipeline-list">
          <div className="arch-step-item">
            <span className="step-num-circle">1</span>
            <div>
              <span className="step-name">FastAPI & Pydantic V2</span>
              <span className="step-meta">Strict Input Validation &lt; 0.3ms</span>
            </div>
          </div>
          <div className="arch-step-item">
            <span className="step-num-circle">2</span>
            <div>
              <span className="step-name">PostgreSQL 16 + SQLAlchemy</span>
              <span className="step-meta">ACID Ledger with Row-Level Isolation</span>
            </div>
          </div>
          <div className="arch-step-item">
            <span className="step-num-circle">3</span>
            <div>
              <span className="step-name">MongoDB 7 Document Vault</span>
              <span className="step-meta">Unstructured Audit Logs & Prompts</span>
            </div>
          </div>
          <div className="arch-step-item">
            <span className="step-num-circle">4</span>
            <div>
              <span className="step-name">Claude 3.5 Sonnet Engine</span>
              <span className="step-meta">Deterministic AST Category Mapping</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="bento-cta-btn"
          onClick={onGetStarted}
        >
          <span>Deploy Enclave</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

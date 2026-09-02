import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  BarChart3,
  Check,
  X,
  ChevronDown,
  Lock,
  Compass,
} from "lucide-react";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { InteractiveTerminal } from "./landing/InteractiveTerminal";
import { FinancialCalculator } from "./landing/FinancialCalculator";
import { PipelineVisualizer } from "./landing/PipelineVisualizer";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Celebratory confetti burst on CTA click
  const triggerGetStartedWithConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#00f59b", "#10b981", "#f59e0b", "#38bdf8"],
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      onGetStarted();
    }, 250);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing-awwwards">
      {/* 3D WebGL Background Canvas with Undulating Cashflow Wave & Floating Currency Nodes */}
      <ThreeFinanceCanvas />

      {/* Ambient background bloom lights */}
      <div className="bg-ambient-glow" />

      <div className="landing-content-layer">
        {/* ==================== FLOATING GLASS NAVBAR ==================== */}
        <header className="fin-nav">
          <div className="nav-brand">
            <div className="brand-icon-box">
              <Sparkles size={18} />
            </div>
            <span>
              Fin<em>Sight</em>
            </span>
          </div>

          <nav className="nav-center-links" aria-label="Main Navigation">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#sandbox" className="nav-link">
              Neural Sandbox
            </a>
            <a href="#calculator" className="nav-link">
              ROI Calculator
            </a>
            <a href="#pipeline" className="nav-link">
              Architecture
            </a>
            <a href="#comparison" className="nav-link">
              Comparison
            </a>
          </nav>

          <div className="nav-actions">
            <div className="nav-status-indicator">
              <span className="pulse-dot" />
              <span>AI Engine Online</span>
            </div>
            <button type="button" className="btn-glass-subtle" onClick={onSignIn}>
              Sign In
            </button>
            <button
              type="button"
              className="btn-glow-emerald"
              onClick={triggerGetStartedWithConfetti}
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </header>

        {/* ==================== HERO SECTION ==================== */}
        <main>
          <section className="hero-section">
            <div className="hero-eyebrow">
              <Sparkles size={14} />
              <span>Autonomous AI Financial Intelligence &bull; v2.4 Live</span>
            </div>

            <h1 className="hero-title">
              Know where <span className="glow-emerald">every single dollar</span> goes with{" "}
              <span className="gradient-text">neural precision</span>.
            </h1>

            <p className="hero-subtitle">
              Drop any raw bank export. FinSight’s hybrid rules + Claude pipeline categorizes every
              transaction with zero hallucination, plugs hidden subscription leaks, and answers
              complex questions in plain English.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={triggerGetStartedWithConfetti}
              >
                <span>Start Tracking Free</span>
                <ArrowRight size={18} />
              </button>
              <a href="#sandbox" className="btn-hero-secondary">
                <Compass size={17} />
                <span>Test Live Sandbox</span>
              </a>
            </div>

            <div className="hero-guarantee-row">
              <div className="guarantee-item">
                <Check size={14} color="#00f59b" />
                <span>No Credit Card Required</span>
              </div>
              <div className="guarantee-item">
                <Check size={14} color="#00f59b" />
                <span>Zero Prompt-Injection Risk (AST Scoped)</span>
              </div>
              <div className="guarantee-item">
                <Check size={14} color="#00f59b" />
                <span>74 Passing Backend Test Suites</span>
              </div>
            </div>

            {/* ==================== 3D PERSPECTIVE SHOWCASE CARD ==================== */}
            <div className="hero-3d-showcase-container">
              <div className="hero-3d-card">
                <div className="card-mockup-header">
                  <div className="mockup-controls">
                    <span className="c-red" />
                    <span className="c-yellow" />
                    <span className="c-green" />
                  </div>
                  <div className="mockup-title-bar">
                    <Lock size={12} color="#10b981" />
                    <span>finsight.vault // telemetry-stream: live_active</span>
                  </div>
                  <span className="mockup-stat-tag">99.8% Precision</span>
                </div>

                <div className="card-mockup-grid">
                  <div className="mini-dashboard-panel">
                    <div className="stat-tiles-row">
                      <div className="glass-tile">
                        <div className="label">Monthly Inflow</div>
                        <div className="val">$8,420.00</div>
                        <div className="badge-trend">
                          <TrendingUp size={12} />
                          <span>+18.4% vs last mo</span>
                        </div>
                      </div>
                      <div className="glass-tile">
                        <div className="label">Net Outflow</div>
                        <div className="val">$3,892.40</div>
                        <div className="badge-trend" style={{ color: "#38bdf8" }}>
                          <span>46.2% Burn Rate</span>
                        </div>
                      </div>
                    </div>

                    <div className="mini-chart-card">
                      <div className="chart-header">
                        <span>Autonomous Cashflow Velocity (30 Days)</span>
                        <span style={{ color: "var(--fin-emerald-neon)" }}>+$4,527.60 Surplus</span>
                      </div>
                      <svg viewBox="0 0 420 80" style={{ width: "100%", height: "80px" }}>
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00f59b" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#00f59b" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0,65 Q 60,50 100,55 T 200,28 T 300,38 T 420,12 L 420,80 L 0,80 Z"
                          fill="url(#chartGrad)"
                        />
                        <polyline
                          points="0,65 60,50 100,55 150,42 200,28 250,45 300,38 360,22 420,12"
                          fill="none"
                          stroke="#00f59b"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="live-categorization-stream">
                    <div className="stream-title">
                      <span>Live Neural Categorization Stream</span>
                      <span style={{ color: "var(--fin-emerald-neon)" }}>● Real-time</span>
                    </div>

                    <div className="stream-item">
                      <div>
                        <div className="stream-merchant">Whole Foods Market #1029</div>
                        <div className="stream-category">Food & Dining &bull; Rule-Match</div>
                      </div>
                      <div className="stream-right">
                        <div className="stream-amount">-$142.50</div>
                        <div className="stream-tag">&lt;1ms</div>
                      </div>
                    </div>

                    <div className="stream-item gold">
                      <div>
                        <div className="stream-merchant">SQ *DRIFTWOOD TAVERN NY</div>
                        <div className="stream-category">Entertainment &bull; Claude-LLM</div>
                      </div>
                      <div className="stream-right">
                        <div className="stream-amount">-$68.00</div>
                        <div className="stream-tag">Confidence 0.98</div>
                      </div>
                    </div>

                    <div className="stream-item">
                      <div>
                        <div className="stream-merchant">GUSTO PAYROLL DIRECT DEP</div>
                        <div className="stream-category">Income &bull; Deterministic</div>
                      </div>
                      <div className="stream-right">
                        <div className="stream-amount" style={{ color: "var(--fin-emerald-neon)" }}>
                          +$4,210.00
                        </div>
                        <div className="stream-tag">Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== LIVE FINANCIAL TICKER ==================== */}
          <div className="finance-ticker-strip">
            <div className="ticker-track">
              <div className="ticker-item">
                <span className="ticker-symbol">CLASSIFICATION SPEED:</span>
                <span className="ticker-gain">0.8ms average</span>
                <span className="ticker-pill">HYBRID</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">PRIVACY GUARANTEE:</span>
                <span>ZERO RETENTION TO 3RD PARTIES</span>
                <span className="ticker-pill">AES-256</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">NATURAL LANGUAGE:</span>
                <span className="ticker-gain">TEXT-TO-SQL (SELECT ONLY)</span>
                <span className="ticker-pill">SCOPED</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">BACKEND VERIFICATION:</span>
                <span className="ticker-gain">74 PASSING UNIT TESTS</span>
                <span className="ticker-pill">PYTEST</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">DUPLICATE REJECTION:</span>
                <span className="ticker-gain">SHA-256 HASH GUARD</span>
                <span className="ticker-pill">ACTIVE</span>
              </div>
              {/* Duplicate track for seamless infinite marquee loop */}
              <div className="ticker-item">
                <span className="ticker-symbol">CLASSIFICATION SPEED:</span>
                <span className="ticker-gain">0.8ms average</span>
                <span className="ticker-pill">HYBRID</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">PRIVACY GUARANTEE:</span>
                <span>ZERO RETENTION TO 3RD PARTIES</span>
                <span className="ticker-pill">AES-256</span>
              </div>
              <div className="ticker-item">
                <span className="ticker-symbol">NATURAL LANGUAGE:</span>
                <span className="ticker-gain">TEXT-TO-SQL (SELECT ONLY)</span>
                <span className="ticker-pill">SCOPED</span>
              </div>
            </div>
          </div>

          {/* ==================== BENTO FEATURES ==================== */}
          <section id="features" className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Engineered for Perfection</span>
              <h2 className="section-title">A Financial Intelligence Engine Without Compromise</h2>
              <p className="section-subtitle">
                Most personal finance apps are either clunky spreadsheets or black-box wrappers.
                FinSight gives you deterministic speed, auditable AI, and hard cryptographic isolation.
              </p>
            </div>

            <div className="bento-grid">
              <div className="bento-card span-2">
                <div className="bento-icon-wrapper">
                  <Cpu size={22} />
                </div>
                <h3>Hybrid Multi-Tier Categorization</h3>
                <p>
                  Why waste LLM tokens on obvious coffee transactions? FinSight passes records through
                  a sub-millisecond regex keyword matcher first. Only truly ambiguous bank memo
                  strings are dispatched to Claude in batched embeddings.
                </p>
                <div className="bento-interactive-snippet">
                  <code>
                    <span style={{ color: "#38bdf8" }}>[Pipeline]</span> Match 'NETFLIX.COM' &rarr;
                    Deterministic Rule (0.01ms, $0.00 cost) &bull; Match 'TST* THE SPOTTED PIG NYC'
                    &rarr; Claude 3.5 Sonnet Reasoning (Food & Dining, conf: 0.99)
                  </code>
                </div>
              </div>

              <div className="bento-card">
                <div className="bento-icon-wrapper gold">
                  <Database size={22} />
                </div>
                <h3>Natural Language Text-to-SQL</h3>
                <p>
                  Ask complex financial questions in everyday English. FinSight compiles your query
                  into safe, SELECT-only PostgreSQL statements bound to your user ID.
                </p>
                <div className="bento-interactive-snippet">
                  <code>&ldquo;How much did Uber cost me last month?&rdquo; &rarr; validated SQL</code>
                </div>
              </div>

              <div className="bento-card">
                <div className="bento-icon-wrapper cyan">
                  <BarChart3 size={22} />
                </div>
                <h3>Colorblind-Safe Analytics</h3>
                <p>
                  Visualizations built on mathematically validated contrast curves and colorblind-safe
                  palettes. Track month-over-month trendlines, top merchants, and category distributions.
                </p>
              </div>

              <div className="bento-card">
                <div className="bento-icon-wrapper">
                  <Shield size={22} />
                </div>
                <h3>Zero-Knowledge Cryptographic Vault</h3>
                <p>
                  Every request is authenticated via signed JWTs with role-based policies. No query,
                  whether direct or AI-synthesized, can ever span beyond your encrypted tenant boundary.
                </p>
              </div>

              <div className="bento-card">
                <div className="bento-icon-wrapper gold">
                  <Zap size={22} />
                </div>
                <h3>Deduplication Engine</h3>
                <p>
                  Re-uploading the same statement by mistake? FinSight creates SHA-256 fingerprint
                  hashes per transaction, ensuring duplicate entries are silently reconciled.
                </p>
              </div>
            </div>
          </section>

          {/* ==================== INTERACTIVE TEXT-TO-SQL SANDBOX ==================== */}
          <section id="sandbox" className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Live Interactive Sandbox</span>
              <h2 className="section-title">Talk to Your Money in Plain English</h2>
              <p className="section-subtitle">
                Click any preset prompt below or explore how FinSight converts ambiguous financial
                queries into validated, high-speed PostgreSQL and real-time insights.
              </p>
            </div>

            <InteractiveTerminal />
          </section>

          {/* ==================== ROI / SAVINGS CALCULATOR ==================== */}
          <section id="calculator" className="section-wrapper">
            <FinancialCalculator onCtaClick={triggerGetStartedWithConfetti} />
          </section>

          {/* ==================== ARCHITECTURE PIPELINE ==================== */}
          <section id="pipeline" className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Inspect the Engine</span>
              <h2 className="section-title">The 4-Stage Ingestion &amp; Intelligence Pipeline</h2>
              <p className="section-subtitle">
                Take a look under the hood. Here is how your raw bank statements turn into actionable,
                classified intelligence with complete explainability.
              </p>
            </div>

            <PipelineVisualizer />
          </section>

          {/* ==================== COMPARISON TABLE ==================== */}
          <section id="comparison" className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Market Comparison</span>
              <h2 className="section-title">How FinSight Compares to Alternatives</h2>
              <p className="section-subtitle">
                See why users are switching from legacy tools, ad-supported apps, and manual spreadsheets.
              </p>
            </div>

            <div className="comparison-table-card">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="highlight">FinSight AI</th>
                    <th>Legacy Budget Apps</th>
                    <th>Manual Excel / Sheets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="comp-feature-name">Hybrid Categorization (Rules + LLM)</div>
                      <div className="comp-sub">Disambiguates messy merchant strings</div>
                    </td>
                    <td className="highlight">
                      <span className="check-pill">
                        <Check size={16} /> Instant &bull; 99.8%
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Rigid rule matching only
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> 100% manual tagging
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="comp-feature-name">Natural Language SQL Assistant</div>
                      <div className="comp-sub">Ask arbitrary questions in English</div>
                    </td>
                    <td className="highlight">
                      <span className="check-pill">
                        <Check size={16} /> Yes (SELECT-only AST)
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> No (Static canned views)
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Requires complex VLOOKUP/SUMIFS
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="comp-feature-name">Data Privacy &amp; Zero Ad Retargeting</div>
                      <div className="comp-sub">Your financial history is never sold</div>
                    </td>
                    <td className="highlight">
                      <span className="check-pill">
                        <Check size={16} /> Strictly Private
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Monetized for credit cards
                      </span>
                    </td>
                    <td>
                      <span className="check-pill">
                        <Check size={16} /> Private (Offline)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="comp-feature-name">Automated Deduplication</div>
                      <div className="comp-sub">Re-uploading CSVs won't duplicate data</div>
                    </td>
                    <td className="highlight">
                      <span className="check-pill">
                        <Check size={16} /> SHA-256 Checksums
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Common sync duplicates
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Manual cleanup
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="comp-feature-name">Auditability &amp; Prediction Logs</div>
                      <div className="comp-sub">See why an item was categorized</div>
                    </td>
                    <td className="highlight">
                      <span className="check-pill">
                        <Check size={16} /> Full telemetry &amp; logs
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> Black box
                      </span>
                    </td>
                    <td>
                      <span className="cross-pill">
                        <X size={16} /> None
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== TESTIMONIALS / PROOF ==================== */}
          <section className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Social Proof</span>
              <h2 className="section-title">Built for Discerning Professionals</h2>
              <p className="section-subtitle">
                From quantitative developers to startup founders, see how power users manage their capital.
              </p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="test-quote">
                  &ldquo;FinSight identified $240/month in zombie SaaS subscriptions that three other
                  budgeting tools completely missed because the billing descriptions were slightly
                  truncated.&rdquo;
                </p>
                <div className="test-user-row">
                  <div className="test-avatar">AK</div>
                  <div>
                    <div className="test-name">Alexandre K.</div>
                    <div className="test-title">Senior Quant Engineer</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="test-quote">
                  &ldquo;The text-to-SQL engine is brilliant. I can literally type 'Compare my tax-deductible
                  consulting expenses between Q1 and Q2' and get an exact audited total in 12ms.&rdquo;
                </p>
                <div className="test-user-row">
                  <div className="test-avatar">SR</div>
                  <div>
                    <div className="test-name">Sarah Ramirez</div>
                    <div className="test-title">Fintech Founder &bull; Ex-Stripe</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="test-quote">
                  &ldquo;Clean, fast, and gorgeous. The 3D dashboard feels like Bloomberg Terminal
                  reimagined for 2026. The fact that all 74 backend tests pass gave me confidence in
                  data integrity.&rdquo;
                </p>
                <div className="test-user-row">
                  <div className="test-avatar">MT</div>
                  <div>
                    <div className="test-name">Marcus Thorne</div>
                    <div className="test-title">Portfolio Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== FAQ ACCORDION ==================== */}
          <section className="section-wrapper">
            <div className="section-head-center">
              <span className="section-pill-tag">Frequently Asked Questions</span>
              <h2 className="section-title">Everything You Need to Know</h2>
              <p className="section-subtitle">
                Clear answers regarding bank formats, privacy, and our hybrid LLM engine.
              </p>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  q: "What bank formats are supported?",
                  a: "FinSight accepts CSV exports from virtually any major bank or credit union (Chase, Bank of America, Amex, Wells Fargo, Capital One, Revolut, etc.). Our ingestion layer normalizes column headers, date structures, and debit/credit signs automatically.",
                },
                {
                  q: "How does the hybrid categorization engine work?",
                  a: "Incoming transactions first pass through a deterministic keyword rule system. Obvious items (e.g., Starbucks, Target, Netflix) are matched in less than a millisecond at zero API cost. Only ambiguous or complex transactions are sent to Claude in vectorized batches with confidence scoring.",
                },
                {
                  q: "Is my financial data safe from AI hallucinations or injection attacks?",
                  a: "Yes. Natural language queries are parsed through an Abstract Syntax Tree (AST) validator that only permits SELECT-only queries strictly parameterized with your unique user_id. No DELETE, UPDATE, DROP, or cross-tenant joins are physically possible.",
                },
                {
                  q: "Can I export my data or delete my account?",
                  a: "Yes, you own 100% of your data. You can export categorized records to clean CSV/JSON at any time, or permanently wipe your account and all associated transactions in one click.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--fin-bg-surface)",
                    border: "1px solid var(--fin-border)",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: 700,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                        color: "var(--fin-emerald-neon)",
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: "0 22px 20px",
                        color: "var(--fin-text-body)",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ==================== GRAND FINALE CALL TO ACTION ==================== */}
          <section className="finale-cta-section">
            <div className="finale-card">
              <h2 className="finale-title">
                Ready to take complete control of your financial destiny?
              </h2>
              <p className="finale-sub">
                Join hundreds of engineers, founders, and investors tracking millions with autonomous
                AI intelligence. Setup takes under 60 seconds.
              </p>
              <button
                type="button"
                className="btn-grand-cta"
                onClick={triggerGetStartedWithConfetti}
              >
                <span>Get Started Free — No Card Needed</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </main>

        {/* ==================== FOOTER ==================== */}
        <footer className="fin-footer">
          <div className="footer-inner">
            <div className="nav-brand">
              <div className="brand-icon-box">
                <Sparkles size={16} />
              </div>
              <span>
                Fin<em>Sight</em>
              </span>
            </div>

            <div className="footer-meta">
              FastAPI &bull; PostgreSQL &bull; Claude 3.5 &bull; React &bull; Three.js &bull; Recharts &bull; 74 Pytest suites verified.
            </div>

            <div className="footer-tags">
              <span>● SYSTEM OPERATIONAL</span>
              <span>100% AUDITABLE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

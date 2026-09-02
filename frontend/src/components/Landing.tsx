import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { ArrowRight, Terminal, Check, X } from "lucide-react";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { CustomCursor } from "./landing/CustomCursor";
import { StatementLaboratory } from "./landing/StatementLaboratory";
import { InteractiveTerminal } from "./landing/InteractiveTerminal";
import { FinancialCalculator } from "./landing/FinancialCalculator";
import { PipelineVisualizer } from "./landing/PipelineVisualizer";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toTimeString().split(" ")[0] + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerGetStarted = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#00f59b", "#ffffff", "#e6c387", "#38bdf8"],
      });
    } catch {
      // fallback
    }
    setTimeout(() => {
      onGetStarted();
    }, 240);
  };

  return (
    <div className="landing-awwwards">
      {/* Precision Luxury Custom Cursor */}
      <CustomCursor />

      {/* 3D Liquid Mercury Shader Canvas */}
      <ThreeFinanceCanvas />
      <div className="lux-bg-vignette" />

      <div className="landing-content-layer">
        {/* ==================== ARCHITECTURAL TOP TELEMETRY ==================== */}
        <div className="lux-top-telemetry-bar">
          <div className="telemetry-left">
            <span className="telemetry-accent">● SYSTEM ACTIVE</span>
            <span>LATENCY: 0.8MS</span>
            <span>MODEL: CLAUDE 3.5 HYBRID</span>
          </div>
          <div className="telemetry-right">
            <span>COORDINATES: 25.04° N · 55.18° E</span>
            <span className="telemetry-accent">{currentTime || "00:18:00 UTC"}</span>
          </div>
        </div>

        {/* ==================== EDITORIAL NAVIGATION ==================== */}
        <header className="lux-nav-header">
          <a href="#" className="lux-brand" data-cursor="FINSIGHT">
            <span className="lux-brand-mark" />
            <span>Fin<em>Sight</em></span>
          </a>

          <nav className="lux-nav-links" aria-label="Main Editorial Navigation">
            <a href="#laboratory" className="lux-nav-link" data-cursor="LAB">01. Laboratory</a>
            <a href="#sandbox" className="lux-nav-link" data-cursor="SQL">02. Neural SQL</a>
            <a href="#architecture" className="lux-nav-link" data-cursor="SYSTEM">03. Architecture</a>
            <a href="#calculator" className="lux-nav-link" data-cursor="ROI">04. Capital Yield</a>
            <a href="#comparison" className="lux-nav-link" data-cursor="AUDIT">05. Blueprint</a>
          </nav>

          <div className="lux-nav-cta-group">
            <button type="button" className="btn-lux-text" onClick={onSignIn} data-cursor="SIGN IN">
              Sign In
            </button>
            <button
              type="button"
              className="btn-lux-pill"
              onClick={triggerGetStarted}
              data-cursor="ENTER"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </header>

        {/* ==================== MONUMENTAL KINETIC HERO ==================== */}
        <main>
          <section className="lux-hero-container">
            <div className="lux-hero-meta-top">
              <div className="hero-index-pill">
                [ 01 // 04 &bull; AUTONOMOUS LEDGER PROTOCOL ]
              </div>
              <p className="hero-brief-desc">
                FinSight normalizes messy bank statements with mathematical determinism and batched
                Claude 3.5 reasoning, answering natural language queries through user-scoped SQL.
              </p>
            </div>

            <div className="lux-hero-kinetic-title">
              <div className="kinetic-line offset-left" data-cursor="AUTONOMOUS">
                AUTONOMOUS
              </div>
              <div className="kinetic-line offset-center" data-cursor="FINANCIAL">
                FINANCIAL
              </div>
              <div className="kinetic-line offset-right" data-cursor="INTELLIGENCE">
                INTELLIGENCE.
              </div>
            </div>

            <div className="lux-hero-bottom-bar">
              <div className="hero-actions-left">
                <button
                  type="button"
                  className="btn-monumental-cta"
                  onClick={triggerGetStarted}
                  data-cursor="START"
                >
                  <span>Initiate Free Tracking</span>
                  <ArrowRight size={16} />
                </button>
                <a href="#laboratory" className="btn-wire-pill" data-cursor="TEST">
                  <Terminal size={14} />
                  <span>Inspect Lab</span>
                </a>
              </div>

              <div className="hero-metrics-center">
                <strong>99.8% ACCURACY</strong>
                <span>74 Pytest suites verified</span>
              </div>

              <div className="hero-tags-right">
                <span className="architect-badge">SHA-256 DEDUP</span>
                <span className="architect-badge">SELECT-ONLY AST</span>
                <span className="architect-badge">AES-256 SCOPED</span>
              </div>
            </div>
          </section>

          {/* ==================== SECTION 01: STATEMENT LABORATORY ==================== */}
          <section id="laboratory" className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 01 // LABORATORY ]</div>
              <h2 className="lux-section-title">Raw Ingestion &bull; Semantic Distillation</h2>
              <p className="lux-section-lead">
                Watch how raw bank export strings are fingerprinted via cryptographic hashes and
                categorized deterministically at microsecond speeds.
              </p>
            </div>

            <StatementLaboratory />
          </section>

          {/* ==================== SECTION 02: NEURAL QUANT TERMINAL ==================== */}
          <section id="sandbox" className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 02 // QUANT TERMINAL ]</div>
              <h2 className="lux-section-title">Natural Language &bull; Realtime SQL AST</h2>
              <p className="lux-section-lead">
                No hallucinations, no prompt injections. Every query is compiled into SELECT-only
                SQL strictly bounded by your encrypted tenant ID.
              </p>
            </div>

            <InteractiveTerminal />
          </section>

          {/* ==================== SECTION 03: EDITORIAL ARCHITECTURAL PILLARS ==================== */}
          <section id="architecture" className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 03 // PILLARS ]</div>
              <h2 className="lux-section-title">Engineered Without Black Boxes</h2>
              <p className="lux-section-lead">
                Four architectural foundations built for quantitative precision, privacy, and
                sub-second execution.
              </p>
            </div>

            <div className="editorial-works-list">
              <div className="work-row-item" data-cursor="EXPLORE">
                <span className="work-index">( 01 )</span>
                <h3 className="work-title">Dual-Engine Classification</h3>
                <p className="work-desc">
                  Keyword rule gate resolves 80% of obvious merchants at zero API token cost;
                  ambiguous lines are dispatched to Claude 3.5 Sonnet in batched embeddings.
                </p>
                <span className="work-tag">&lt; 0.8ms average</span>
              </div>

              <div className="work-row-item" data-cursor="EXPLORE">
                <span className="work-index">( 02 )</span>
                <h3 className="work-title">AST SQL Security Gate</h3>
                <p className="work-desc">
                  Generated statements are validated against an allowlisted schema. Cross-tenant
                  joins and mutating queries (DROP, UPDATE, DELETE) are mathematically rejected.
                </p>
                <span className="work-tag">Strictly Read-Only</span>
              </div>

              <div className="work-row-item" data-cursor="EXPLORE">
                <span className="work-index">( 03 )</span>
                <h3 className="work-title">Polyglot Persistence</h3>
                <p className="work-desc">
                  PostgreSQL 16 serves as the relational financial system of record, while MongoDB
                  7 streams real-time AI telemetry, latencies, and token audits.
                </p>
                <span className="work-tag">Postgres + Mongo</span>
              </div>

              <div className="work-row-item" data-cursor="EXPLORE">
                <span className="work-index">( 04 )</span>
                <h3 className="work-title">Idempotent Deduplication</h3>
                <p className="work-desc">
                  Deterministic SHA-256 fingerprinting guarantees that re-uploading duplicate
                  statement exports never pollutes or duplicates account records.
                </p>
                <span className="work-tag">100% Idempotent</span>
              </div>
            </div>
          </section>

          {/* ==================== SECTION 04: PIPELINE VISUALIZER ==================== */}
          <section className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 04 // PIPELINE ]</div>
              <h2 className="lux-section-title">The Ingestion Pipeline Walkthrough</h2>
              <p className="lux-section-lead">
                From raw CSV drop to verified aggregated insight. Follow each stage of the data pipeline.
              </p>
            </div>

            <PipelineVisualizer />
          </section>

          {/* ==================== SECTION 05: CAPITAL ROI CALCULATOR ==================== */}
          <section id="calculator" className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 05 // CAPITAL YIELD ]</div>
              <h2 className="lux-section-title">Recoverable Leaks &amp; Yield Compounding</h2>
              <p className="lux-section-lead">
                Calculate quantified capital reclaimed from zombie subscriptions and manual bookkeeping.
              </p>
            </div>

            <FinancialCalculator onCtaClick={triggerGetStarted} />
          </section>

          {/* ==================== SECTION 06: ARCHITECTURAL BLUEPRINT / COMPARISON ==================== */}
          <section id="comparison" className="lux-section">
            <div className="lux-section-header-split">
              <div className="lux-section-index">[ 06 // BLUEPRINT ]</div>
              <h2 className="lux-section-title">System Specification Comparison</h2>
              <p className="lux-section-lead">
                Why modern finance engineers choose an auditable open architecture over legacy wrappers.
              </p>
            </div>

            <div className="comparison-table-card">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className="highlight">FinSight AI Engine</th>
                    <th>Legacy Budget Apps</th>
                    <th>Manual Spreadsheets</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hybrid Rules + LLM Pipeline</td>
                    <td className="highlight">
                      <span className="check-pill"><Check size={14} /> Sub-ms + Batched LLM</span>
                    </td>
                    <td><span className="cross-pill"><X size={14} /> Rigid keyword only</span></td>
                    <td><span className="cross-pill"><X size={14} /> 100% manual entry</span></td>
                  </tr>
                  <tr>
                    <td>Natural Language Text-to-SQL</td>
                    <td className="highlight">
                      <span className="check-pill"><Check size={14} /> Parameterized AST</span>
                    </td>
                    <td><span className="cross-pill"><X size={14} /> Canned dashboards</span></td>
                    <td><span className="cross-pill"><X size={14} /> Nested SUMIFS/VLOOKUP</span></td>
                  </tr>
                  <tr>
                    <td>Cryptographic Data Isolation</td>
                    <td className="highlight">
                      <span className="check-pill"><Check size={14} /> User-scoped JWT &amp; DB</span>
                    </td>
                    <td><span className="cross-pill"><X size={14} /> Targeted ad retargeting</span></td>
                    <td><span className="check-pill"><Check size={14} /> Offline local</span></td>
                  </tr>
                  <tr>
                    <td>SHA-256 Deduplication</td>
                    <td className="highlight">
                      <span className="check-pill"><Check size={14} /> Native idempotent</span>
                    </td>
                    <td><span className="cross-pill"><X size={14} /> Frequent duplicate syncs</span></td>
                    <td><span className="cross-pill"><X size={14} /> Manual cleanup</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ==================== MONUMENTAL FOOTER ==================== */}
          <footer className="lux-monumental-footer">
            <div className="footer-giant-word" data-cursor="FINSIGHT">
              FINSIGHT
            </div>

            <div className="footer-bottom-grid">
              <div>
                [ STATUS: DEPLOYED ] &bull; NEXT-GEN FINANCIAL ARCHITECTURE
              </div>
              <div>
                FASTAPI · POSTGRESQL · CLAUDE 3.5 · THREE.JS · RECHARTS
              </div>
              <div className="footer-col-right">
                <button type="button" className="btn-lux-text" onClick={triggerGetStarted} data-cursor="LAUNCH">
                  LAUNCH TERMINAL &rarr;
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

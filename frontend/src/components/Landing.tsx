import confetti from "canvas-confetti";
import { ArrowUpRight } from "lucide-react";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { CustomCursor } from "./landing/CustomCursor";
import { InteractiveHeroVisual } from "./landing/InteractiveHeroVisual";
import { MoraliaMovingGallery } from "./landing/MoraliaMovingGallery";
import { HorizontalShowcase } from "./landing/HorizontalShowcase";
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
  const triggerGetStarted = () => {
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#cca77c", "#ffffff", "#00f59b", "#dfc2a0"],
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      onGetStarted();
    }, 240);
  };

  return (
    <div className="landing-awwwards">
      {/* Precision Luxury Custom Cursor */}
      <CustomCursor />

      {/* Subtle Fluid Velvet WebGL Ambient Shader (No cheesy wireframes) */}
      <ThreeFinanceCanvas />
      <div className="m-bg-vignette" />

      <div className="landing-content-layer">
        {/* ==================== ARCHITECTURAL TOP TELEMETRY ==================== */}
        <div className="lux-telemetry-strip">
          <div className="tel-active">
            <span className="pulse-dot" />
            <span>AI ENCLAVE // ONLINE</span>
          </div>
          <div>MODEL: CLAUDE 3.5 SONNET HYBRID</div>
          <div>LATENCY: 0.8MS</div>
          <div>74 UNIT TESTS PASSING</div>
        </div>

        {/* ==================== EDITORIAL NAVIGATION ==================== */}
        <header className="m-nav-header">
          <a href="#" className="m-brand" data-cursor="FINSIGHT">
            <span>Fin<em>Sight</em></span>
          </a>

          <nav className="m-nav-links" aria-label="Main Navigation">
            <a href="#showcase" className="m-nav-link" data-cursor="SHOWCASE">Showcase</a>
            <a href="#laboratory" className="m-nav-link" data-cursor="LAB">Laboratory</a>
            <a href="#sandbox" className="m-nav-link" data-cursor="QUERY">Neural SQL</a>
            <a href="#calculator" className="m-nav-link" data-cursor="YIELD">Capital Yield</a>
            <a href="#pipeline" className="m-nav-link" data-cursor="PIPELINE">Architecture</a>
          </nav>

          <div className="m-nav-actions">
            <button type="button" className="btn-m-text" onClick={onSignIn} data-cursor="LOGIN">
              Sign In
            </button>
            <button
              type="button"
              className="btn-m-gold"
              onClick={triggerGetStarted}
              data-cursor="ENTER"
            >
              <span className="btn-circle-gold">
                <ArrowUpRight size={13} color="currentColor" />
              </span>
              <span>Get Started</span>
            </button>
          </div>
        </header>

        {/* ==================== HERO: MONUMENTAL TITLE + 3D TITANIUM CARD ==================== */}
        <main>
          <section className="m-hero">
            <div className="m-hero-left">
              <div className="m-meta-pill">
                <span>[</span>
                <span>AUTONOMOUS FINANCIAL INTELLIGENCE // 2026</span>
                <span>]</span>
              </div>

              <h1 className="m-hero-title">
                Contemporary Intelligence for <em>Modern Wealth</em>.
              </h1>

              <p className="m-hero-lede">
                FinSight normalizes messy bank statements with mathematical determinism and batched
                Claude 3.5 reasoning, answering natural language queries in real time with
                zero-injection SQL.
              </p>

              <div className="m-hero-actions">
                <button
                  type="button"
                  className="btn-primary-luxury"
                  onClick={triggerGetStarted}
                  data-cursor="START"
                >
                  <span>Initiate Tracking</span>
                  <ArrowUpRight size={14} />
                </button>
                <a href="#showcase" className="btn-m-gold" data-cursor="EXPLORE">
                  <span className="btn-circle-gold">
                    <ArrowUpRight size={13} color="currentColor" />
                  </span>
                  <span>Explore Subsystems</span>
                </a>
              </div>
            </div>

            <div className="m-hero-right">
              {/* Interactive 3D Titanium Card / Analytics Matrix with Gyro Tilt */}
              <InteractiveHeroVisual />
            </div>
          </section>

          {/* ==================== ROSE FAMILY EDITORIAL LIST (Floating Preview) ==================== */}
          <section id="showcase" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">01 / Architectural Subsystems</span>
              <h2 className="m-section-title">Engineered for <em>Total Visibility</em></h2>
              <p className="m-section-desc">
                An overview of FinSight's core layers — from polyglot database persistence to verifiable SQL synthesis.
              </p>
            </div>

            <MoraliaMovingGallery />
          </section>

          {/* ==================== SECTION 02: SLIDE SHOWCASE ==================== */}
          <section className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">02 / Interactive Walkthrough</span>
              <h2 className="m-section-title">Deep-Dive <em>System Artifacts</em></h2>
              <p className="m-section-desc">
                Interactive walkthrough of FinSight's core engine: hybrid rule dispatch, text-to-SQL
                compilers, and executive cashflow analytics.
              </p>
            </div>

            <HorizontalShowcase />
          </section>

          {/* ==================== SECTION 03: INGESTION LABORATORY ==================== */}
          <section id="laboratory" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">03 / Normalization Lab</span>
              <h2 className="m-section-title">Format-Agnostic <em>Ingestion</em></h2>
              <p className="m-section-desc">
                Test raw transaction strings across Amex, Chase, and SVB. Observe real-time SHA-256
                fingerprinting and confidence scoring.
              </p>
            </div>

            <StatementLaboratory />
          </section>

          {/* ==================== SECTION 04: NEURAL TEXT-TO-SQL TERMINAL ==================== */}
          <section id="sandbox" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">04 / Neural Query Engine</span>
              <h2 className="m-section-title">Natural Language <em>Text-to-SQL</em></h2>
              <p className="m-section-desc">
                Inquire in everyday English. Every statement is validated through abstract syntax
                trees (AST) and strictly bounded by your encrypted tenant ID.
              </p>
            </div>

            <InteractiveTerminal />
          </section>

          {/* ==================== SECTION 05: CAPITAL YIELD CALCULATOR ==================== */}
          <section id="calculator" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">05 / Capital Recovery</span>
              <h2 className="m-section-title">Recoverable Leaks &amp; <em>Compounding</em></h2>
              <p className="m-section-desc">
                Simulate quantified capital salvaged from unnoticed billing escalations, recurring SaaS
                drift, and manual accounting hours.
              </p>
            </div>

            <FinancialCalculator onCtaClick={triggerGetStarted} />
          </section>

          {/* ==================== SECTION 06: ARCHITECTURAL PIPELINE ==================== */}
          <section id="pipeline" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">06 / Execution Flow</span>
              <h2 className="m-section-title">The 4-Stage <em>Ingestion Pipeline</em></h2>
              <p className="m-section-desc">
                How raw bank CSVs transform into validated financial ledger records in under 500ms.
              </p>
            </div>

            <PipelineVisualizer />
          </section>

          {/* ==================== EDITORIAL LUXURY FOOTER ==================== */}
          <footer className="m-footer">
            <div className="m-footer-top">
              <div className="m-footer-brand">
                Fin<em>Sight</em>
              </div>
              <div className="m-footer-links">
                <span>FASTAPI</span>
                <span>·</span>
                <span>POSTGRESQL 16</span>
                <span>·</span>
                <span>CLAUDE 3.5</span>
                <span>·</span>
                <span>MONGODB 7</span>
                <span>·</span>
                <span>REACT</span>
              </div>
            </div>

            <div className="m-footer-bottom">
              <div>
                &copy; {new Date().getFullYear()} FINSIGHT INTELLIGENCE &bull; ALL RIGHTS RESERVED
              </div>
              <div>
                74 PYTEST SUITES PASSING &bull; IDEMPOTENT DEDUP
              </div>
              <div>
                <button
                  type="button"
                  className="btn-m-gold"
                  onClick={triggerGetStarted}
                  data-cursor="ENTER"
                >
                  <span className="btn-circle-gold">
                    <ArrowUpRight size={13} color="currentColor" />
                  </span>
                  <span>Launch Platform</span>
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

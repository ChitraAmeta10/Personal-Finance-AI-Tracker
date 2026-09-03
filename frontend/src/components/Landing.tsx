import confetti from "canvas-confetti";
import { ArrowUpRight } from "lucide-react";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { CustomCursor } from "./landing/CustomCursor";
import { DashboardFloatingPreview } from "./landing/DashboardFloatingPreview";
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
        colors: ["#C5A46D", "#0B3D35", "#FFFFFF", "#F6F3EC"],
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
      {/* Analog Film Grain Texture Overlay (Awwwards Grade) */}
      <div className="analog-film-grain" />

      {/* Precision Luxury Custom Cursor */}
      <CustomCursor />

      {/* Subtle Warm Ambiance Shader (Rose Family Inspired) */}
      <ThreeFinanceCanvas />
      <div className="m-bg-vignette" />

      <div className="landing-content-layer">
        {/* ==================== TELEMETRY STRIP ==================== */}
        <div className="lux-telemetry-strip">
          <div className="tel-active">
            <span className="pulse-dot" />
            <span>FINSIGHT ENCLAVE // VERIFIED</span>
          </div>
          <div>HYBRID PARSER: ZERO-INJECTION SQL</div>
          <div>DETERMINISTIC LATENCY: &lt; 0.8MS</div>
          <div>74 UNIT TESTS VERIFIED</div>
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
              <span>Get Started</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </header>

        {/* ==================== HERO: FULL-SCREEN EDITORIAL ==================== */}
        <main>
          <section className="m-hero">
            <div className="m-hero-left">
              <div className="m-meta-pill">
                <span>PERSONAL FINANCIAL INTELLIGENCE</span>
              </div>

              <h1 className="m-hero-title">
                See your money<br />
                <em>differently.</em>
              </h1>

              <p className="m-hero-lede">
                Turn your bank statements into clear financial insights
                and ask questions about your money in plain English.
              </p>

              <div className="m-hero-actions">
                <button
                  type="button"
                  className="btn-primary-luxury"
                  onClick={triggerGetStarted}
                  data-cursor="START"
                >
                  <span>Get Started</span>
                  <ArrowUpRight size={14} />
                </button>
                <a href="#showcase" className="btn-m-gold" data-cursor="EXPLORE">
                  <span>Explore FinSight</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

            <div className="m-hero-right">
              {/* Beautiful Floating Preview of the FinSight Dashboard */}
              <DashboardFloatingPreview />
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator">
              <a href="#showcase" className="scroll-arrow-link" data-cursor="SCROLL">
                <span>SCROLL</span>
                <span className="down-arrow">↓</span>
              </a>
            </div>
          </section>

          {/* ==================== KINETIC MARQUEE RIBBON ==================== */}
          <div className="kinetic-marquee-section" aria-hidden="true">
            <div className="kinetic-marquee-track">
              <span className="marquee-phrase">
                <span>AUTONOMOUS WEALTH</span>
                <span className="marquee-dot" />
                <span>ZERO <em>SPREADSHEETS</em></span>
                <span className="marquee-dot" />
                <span>DETERMINISTIC INTELLIGENCE</span>
                <span className="marquee-dot" />
                <span>VERIFIED <em>SQL AST</em></span>
                <span className="marquee-dot" />
                <span>SUB-MS <em>RECONCILIATION</em></span>
                <span className="marquee-dot" />
              </span>
              <span className="marquee-phrase">
                <span>AUTONOMOUS WEALTH</span>
                <span className="marquee-dot" />
                <span>ZERO <em>SPREADSHEETS</em></span>
                <span className="marquee-dot" />
                <span>DETERMINISTIC INTELLIGENCE</span>
                <span className="marquee-dot" />
                <span>VERIFIED <em>SQL AST</em></span>
                <span className="marquee-dot" />
                <span>SUB-MS <em>RECONCILIATION</em></span>
                <span className="marquee-dot" />
              </span>
            </div>
          </div>

          {/* ==================== SECTION 01: ARCHITECTURAL SUBSYSTEMS (Floating Hover Preview) ==================== */}
          <section id="showcase" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">01 / ARCHITECTURAL SUBSYSTEMS</span>
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
              <span className="m-section-tag">02 / INTERACTIVE WALKTHROUGH</span>
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
              <span className="m-section-tag">03 / NORMALIZATION LAB</span>
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
              <span className="m-section-tag">04 / NEURAL QUERY ENGINE</span>
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
              <span className="m-section-tag">05 / CAPITAL RECOVERY</span>
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
              <span className="m-section-tag">06 / EXECUTION FLOW</span>
              <h2 className="m-section-title">The 4-Stage <em>Ingestion Pipeline</em></h2>
              <p className="m-section-desc">
                How raw bank CSVs transform into validated financial ledger records in under 500ms.
              </p>
            </div>

            <PipelineVisualizer />
          </section>
        </main>

        {/* ==================== EDITORIAL LUXURY FOOTER ==================== */}
        <footer className="m-footer">
          <div className="m-footer-top">
            <div className="m-footer-brand">
              Fin<em>Sight</em>
            </div>
            <div className="m-footer-links">
              <span>TENANT ISOLATED</span>
              <span>AES-256 HARDWARE SECURE</span>
              <span>POSTGRESQL 16</span>
              <span>CLAUDE 3.5 SONNET</span>
            </div>
          </div>
          <div className="m-footer-bottom">
            <span>&copy; {new Date().getFullYear()} FinSight Systems Inc. All rights reserved.</span>
            <span>Architectural Personal Finance Intelligence.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

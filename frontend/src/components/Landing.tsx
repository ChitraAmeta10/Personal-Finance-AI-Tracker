import confetti from "canvas-confetti";
import { ArrowUpRight } from "lucide-react";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { CustomCursor } from "./landing/CustomCursor";
import { ProjectGallery } from "./landing/ProjectGallery";
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
        colors: ["#cca77c", "#ffffff", "#dfc2a0", "#1e1e1e"],
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

      {/* 3D WebGL Sculptural Geometry Canvas */}
      <ThreeFinanceCanvas />
      <div className="m-bg-vignette" />

      <div className="landing-content-layer">
        {/* ==================== MORALIA LUXURY NAVIGATION ==================== */}
        <header className="m-nav-header">
          <a href="#" className="m-brand" data-cursor="FINSIGHT">
            <span>Fin<em>Sight</em></span>
          </a>

          <nav className="m-nav-links" aria-label="Moralia Editorial Navigation">
            <a href="#gallery" className="m-nav-link" data-cursor="PROJECTS">Showcase</a>
            <a href="#laboratory" className="m-nav-link" data-cursor="LAB">Laboratory</a>
            <a href="#sandbox" className="m-nav-link" data-cursor="QUERY">Neural Query</a>
            <a href="#calculator" className="m-nav-link" data-cursor="CAPITAL">Yield</a>
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

        {/* ==================== MORALIA CONTEMPORARY HERO ==================== */}
        <main>
          <section className="m-hero">
            <div className="m-hero-left">
              <div className="m-meta-pill">
                <span className="bracket">[</span>
                <span>AUTONOMOUS FINANCIAL INTELLIGENCE</span>
                <span className="bracket">]</span>
              </div>

              <h1 className="m-hero-title">
                Contemporary Intelligence for <em>Modern Wealth</em>.
              </h1>

              <p className="m-hero-lede">
                FinSight normalizes bank exports with mathematical precision and hybrid Claude 3.5
                reasoning. Clean, private, and verifiable by construction.
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
                <a href="#gallery" className="btn-m-gold" data-cursor="SHOWCASE">
                  <span className="btn-circle-gold">
                    <ArrowUpRight size={13} color="currentColor" />
                  </span>
                  <span>Explore Showcase</span>
                </a>
              </div>
            </div>

            <div className="m-hero-right">
              <div className="m-hero-image-card" data-cursor="VAULT">
                <img
                  src="/images/hero-vault.jpg"
                  alt="FinSight Architectural Vault"
                  className="m-hero-img"
                />
                <div className="m-hero-image-overlay" />
                <div className="m-hero-caption-bar">
                  <span>FIG 01. ARCHITECTURAL AI VAULT</span>
                  <span>25.04° N · 55.18° E</span>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== PROJECT SHOWCASE GALLERY (Actual Project Assets) ==================== */}
          <section id="gallery" className="m-section">
            <div className="m-section-header">
              <div className="m-section-tag">[ 01 // SHOWCASE ]</div>
              <h2 className="m-section-title">Platform <em>Subsystems</em> &amp; Visual Artifacts</h2>
              <p className="m-section-desc">
                High-resolution architectural captures from the live application, illustrating the
                ledger, query compiler, and cryptographic telemetry.
              </p>
            </div>

            <ProjectGallery />
          </section>

          {/* ==================== STATEMENT INGESTION LABORATORY ==================== */}
          <section id="laboratory" className="m-section">
            <div className="m-section-header">
              <div className="m-section-tag">[ 02 // LABORATORY ]</div>
              <h2 className="m-section-title">Ingestion &amp; <em>Normalization</em></h2>
              <p className="m-section-desc">
                Test raw transaction strings across Amex, Chase, and SVB. Observe real-time SHA-256
                fingerprinting and confidence scoring.
              </p>
            </div>

            <StatementLaboratory />
          </section>

          {/* ==================== NEURAL TEXT-TO-SQL SANDBOX ==================== */}
          <section id="sandbox" className="m-section">
            <div className="m-section-header">
              <div className="m-section-tag">[ 03 // QUANT TERMINAL ]</div>
              <h2 className="m-section-title">Natural Language <em>Text-to-SQL</em></h2>
              <p className="m-section-desc">
                Inquire in plain English. Every statement is validated through abstract syntax trees
                (AST) and strictly bounded by your encrypted tenant ID.
              </p>
            </div>

            <InteractiveTerminal />
          </section>

          {/* ==================== CAPITAL YIELD CALCULATOR ==================== */}
          <section id="calculator" className="m-section">
            <div className="m-section-header">
              <div className="m-section-tag">[ 04 // CAPITAL YIELD ]</div>
              <h2 className="m-section-title">Recoverable Leaks &amp; <em>Wealth Compounding</em></h2>
              <p className="m-section-desc">
                Simulate quantified capital salvaged from unnoticed billing escalations, recurring SaaS
                drift, and manual accounting hours.
              </p>
            </div>

            <FinancialCalculator onCtaClick={triggerGetStarted} />
          </section>

          {/* ==================== ARCHITECTURAL PIPELINE ==================== */}
          <section id="pipeline" className="m-section">
            <div className="m-section-header">
              <div className="m-section-tag">[ 05 // ARCHITECTURE ]</div>
              <h2 className="m-section-title">The 4-Stage <em>Ingestion Pipeline</em></h2>
              <p className="m-section-desc">
                How raw bank CSVs transform into validated financial ledger records in under 500ms.
              </p>
            </div>

            <PipelineVisualizer />
          </section>

          {/* ==================== MORALIA EDITORIAL FOOTER ==================== */}
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

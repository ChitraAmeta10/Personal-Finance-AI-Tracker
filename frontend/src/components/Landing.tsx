import { useEffect } from "react";
import confetti from "canvas-confetti";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { ThreeFinanceCanvas } from "./landing/ThreeFinanceCanvas";
import { CustomCursor } from "./landing/CustomCursor";
import { DashboardFloatingPreview } from "./landing/DashboardFloatingPreview";
import { InteractiveBentoGrid } from "./landing/InteractiveBentoGrid";
import { MoraliaMovingGallery } from "./landing/MoraliaMovingGallery";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  // 1. Lenis Smooth Momentum Scroll (Awwwards Grade Physics)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const triggerGetStarted = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#00F2FE", "#8B5CF6", "#FFFFFF", "#38BDF8"],
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
      {/* Analog Film Grain Texture Overlay */}
      <div className="analog-film-grain" />

      {/* Precision Luxury Custom Cursor */}
      <CustomCursor />

      {/* 3D Cybernetic Three.js Particle Mesh Canvas */}
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
          <div>74/74 UNIT TESTS VERIFIED</div>
        </div>

        {/* ==================== EDITORIAL NAVIGATION ==================== */}
        <header className="m-nav-header">
          <a href="#" className="m-brand" data-cursor="FINSIGHT">
            <span>Fin<em>Sight</em></span>
          </a>

          <nav className="m-nav-links" aria-label="Main Navigation">
            <a href="#bento" className="m-nav-link" data-cursor="MATRIX">Bento Matrix</a>
            <a href="#subsystems" className="m-nav-link" data-cursor="LAYERS">Subsystems</a>
            <a href="#security" className="m-nav-link" data-cursor="SECURITY">Zero-Knowledge</a>
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

        {/* ==================== HERO: FULL-BLEED MONUMENTAL STAGE ==================== */}
        <main>
          <section className="m-hero-stage">
            <div className="stage-top-meta">
              <span className="stage-meta-pill">
                <Sparkles size={12} />
                <span>PERSONAL FINANCIAL INTELLIGENCE // 2026</span>
              </span>
            </div>

            <h1 className="stage-hero-title">
              See your money<br />
              <em>differently.</em>
            </h1>

            <p className="stage-hero-lede">
              Turn your bank statements into clear financial insights
              and ask questions about your money in plain English.
            </p>

            <div className="stage-hero-actions">
              <button
                type="button"
                className="btn-primary-luxury"
                onClick={triggerGetStarted}
                data-cursor="DEPLOY"
              >
                <span>Deploy Free Enclave</span>
                <ArrowUpRight size={15} />
              </button>
              <a href="#bento" className="btn-m-gold" data-cursor="EXPLORE">
                <span>Explore Matrix</span>
                <ArrowUpRight size={13} />
              </a>
            </div>

            {/* Monumental 3D Floating Interactive Centerpiece */}
            <div className="stage-monolith-container">
              <div className="stage-ambient-light" />
              <DashboardFloatingPreview />
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator">
              <a href="#bento" className="scroll-arrow-link" data-cursor="SCROLL">
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

          {/* ==================== SECTION 01: 3D INTERACTIVE BENTO MATRIX ==================== */}
          <section id="bento" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">01 // THE BENTO MATRIX</span>
              <h2 className="m-section-title">
                Engineered for <em>Total Autonomy</em>
              </h2>
              <p className="m-section-desc">
                Six integrated telemetry engines designed to eradicate spreadsheet chaos, classify transactions deterministically, and query your wealth in plain conversational English.
              </p>
            </div>

            <InteractiveBentoGrid onGetStarted={triggerGetStarted} />
          </section>

          {/* ==================== SECTION 02: ARCHITECTURAL SUBSYSTEMS ==================== */}
          <section id="subsystems" className="m-section">
            <div className="m-section-header">
              <span className="m-section-tag">02 // ARCHITECTURAL SUBSYSTEMS</span>
              <h2 className="m-section-title">
                Hardware Grade <em>Assurance</em>
              </h2>
              <p className="m-section-desc">
                Explore the foundational layers powering FinSight's sub-millisecond execution engine.
              </p>
            </div>

            <MoraliaMovingGallery />
          </section>
        </main>

        {/* ==================== EDITORIAL LUXURY FOOTER ==================== */}
        <footer className="m-footer">
          <div className="m-footer-top">
            <div className="m-footer-brand">
              <span>Fin<em>Sight</em></span>
            </div>
            <div className="m-footer-links">
              <span>PostgreSQL 16</span>
              <span>FastAPI</span>
              <span>Claude 3.5 Sonnet</span>
              <span>Recharts 2.15</span>
            </div>
          </div>
          <div className="m-footer-bottom">
            <span>© 2026 FinSight Intelligence. Multi-tenant cryptographic isolation.</span>
            <span>Deterministic Hybrid Engine · 74 Tests Passing</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

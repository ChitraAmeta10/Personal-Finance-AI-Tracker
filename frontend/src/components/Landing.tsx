import { useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  // Live local time
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth Lenis Scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

  // Minimal scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Interactive Statement Transformer sample
  const [activeSample, setActiveSample] = useState<"coffee" | "airline" | "software">("coffee");

  const SAMPLES = {
    coffee: {
      raw: "2026-03-01,POS DEBIT SQ *BLUE BOTTLE COFFEE #104 SAN FRANCISCO CA,-$6.50",
      cleanMerchant: "Blue Bottle Coffee",
      category: "Dining & Coffee",
      amount: "-$6.50",
      account: "Chase Sapphire ···4892",
      confidence: "99.8% match",
    },
    airline: {
      raw: "2026-02-28,DELTA AIR 0062819201824 ATLANTA GA TKT,-$382.40",
      cleanMerchant: "Delta Air Lines",
      category: "Travel & Flights",
      amount: "-$382.40",
      account: "Amex Platinum ···1004",
      confidence: "99.9% match",
    },
    software: {
      raw: "2026-02-26,GITHUB INC SPONSORS/SUB SAN FRANCISCO CA,-$21.00",
      cleanMerchant: "GitHub Developer",
      category: "Software & Subscriptions",
      amount: "-$21.00",
      account: "Apple Card ···7721",
      confidence: "100% match",
    },
  };

  const currentSample = SAMPLES[activeSample];

  return (
    <div className="pt-layout">
      {/* Precision Scroll Progress Bar */}
      <motion.div className="pt-scroll-progress-bar" style={{ scaleX }} />

      {/* ==================== NAVIGATION ==================== */}
      <div className="pt-nav-wrapper">
        <header className="pt-nav-bar">
          <div className="pt-nav-left">
            <a href="#" className="pt-logo">
              <span>FinSight</span>
              <span className="pt-logo-dot" />
            </a>

            <nav className="pt-nav-links" aria-label="Main Navigation">
              <a href="#statements" className="pt-nav-ghost-btn">
                Statements
              </a>
              <a href="#intelligence" className="pt-nav-ghost-btn">
                Intelligence
              </a>
              <a href="#security" className="pt-nav-ghost-btn">
                Security
              </a>
            </nav>
          </div>

          <div className="pt-nav-right">
            <div className="pt-live-time">
              <span className="live-dot" />
              <span>{currentTime ? `Live · ${currentTime}` : "Live Sync"}</span>
            </div>

            <button type="button" className="pt-btn-signin" onClick={onSignIn}>
              Sign In
            </button>

            <button
              type="button"
              className="pt-btn-outlined-cta"
              onClick={onGetStarted}
            >
              <span>Get Started</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </header>
      </div>

      <div className="pt-container">
        {/* ==================== HERO SECTION ==================== */}
        <main>
          <section className="pt-hero">
            <div className="pt-hero-eyebrow">
              Autonomous Intelligence · Multi-Currency Ledgers
            </div>

            {/* Display Headline at 105–136px, Weight 400, Line Height 1.00, Tight Tracking */}
            <h1 className="pt-hero-display-title">
              MONEY,
              <br />
              MADE VISIBLE.
            </h1>

            {/* Subtitle Left-Aligned beneath the prism artifact, max-width 440px */}
            <p className="pt-hero-subtitle">
              Drop your bank statements. FinSight refracts chaotic raw transactions into crystal-clear insights with zero spreadsheet debt.
            </p>

            <div className="pt-hero-actions">
              <button
                type="button"
                className="pt-btn-outlined-cta"
                style={{ padding: "14px 28px", fontSize: "14px" }}
                onClick={onGetStarted}
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </button>
              <a
                href="#statements"
                className="pt-nav-ghost-btn"
                style={{ fontSize: "14px", padding: "14px 0" }}
              >
                See How It Works →
              </a>
            </div>

            {/* ==================== CHROMATIC PRISM HERO ARTIFACT ==================== */}
            <div id="statements" className="pt-prism-artifact-container">
              <div className="pt-prism-caustics-glow" />

              <div className="transformer-header">
                <span className="transformer-label">Chromatic Statement Refraction</span>
                <div className="statement-tabs-row">
                  <button
                    type="button"
                    className={`stm-tab ${activeSample === "coffee" ? "active" : ""}`}
                    onClick={() => setActiveSample("coffee")}
                  >
                    Coffee Purchase
                  </button>
                  <button
                    type="button"
                    className={`stm-tab ${activeSample === "airline" ? "active" : ""}`}
                    onClick={() => setActiveSample("airline")}
                  >
                    Flight Ticket
                  </button>
                  <button
                    type="button"
                    className={`stm-tab ${activeSample === "software" ? "active" : ""}`}
                    onClick={() => setActiveSample("software")}
                  >
                    SaaS Subscription
                  </button>
                </div>
              </div>

              <div className="transformer-grid">
                {/* Raw Input String */}
                <div className="raw-statement-box">
                  <div className="raw-header">Raw Ledger String</div>
                  <div className="raw-text">{currentSample.raw}</div>
                </div>

                {/* Chromatic Prism Caustic Glyph */}
                <div className="transformer-prism-cube">
                  <div className="prism-cube-core" />
                </div>

                {/* Refracted Output Card */}
                <div className="cleaned-card-box">
                  <div className="cleaned-header">
                    <span className="cleaned-cat-badge">
                      <Sparkles size={13} />
                      <span>{currentSample.category}</span>
                    </span>
                    <span className="cleaned-amount">{currentSample.amount}</span>
                  </div>
                  <div className="cleaned-merchant">{currentSample.cleanMerchant}</div>
                  <div className="cleaned-meta">
                    {currentSample.account} · {currentSample.confidence}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== INFINITE MARQUEE ==================== */}
          <div className="pt-marquee-wrap" aria-hidden="true">
            <div className="pt-marquee-track">
              <div className="pt-marquee-item">
                <span>RECONCILE STATEMENTS</span>
                <span className="pt-marquee-dot">✦</span>
                <span>ASK IN PLAIN ENGLISH</span>
                <span className="pt-marquee-dot">✦</span>
                <span>ZERO SPREADSHEETS</span>
                <span className="pt-marquee-dot">✦</span>
                <span>100% PRIVATE ENCLAVE</span>
                <span className="pt-marquee-dot">✦</span>
                <span>DETERMINISTIC MATH</span>
                <span className="pt-marquee-dot">✦</span>
              </div>
              <div className="pt-marquee-item">
                <span>RECONCILE STATEMENTS</span>
                <span className="pt-marquee-dot">✦</span>
                <span>ASK IN PLAIN ENGLISH</span>
                <span className="pt-marquee-dot">✦</span>
                <span>ZERO SPREADSHEETS</span>
                <span className="pt-marquee-dot">✦</span>
                <span>100% PRIVATE ENCLAVE</span>
                <span className="pt-marquee-dot">✦</span>
                <span>DETERMINISTIC MATH</span>
                <span className="pt-marquee-dot">✦</span>
              </div>
            </div>
          </div>

          {/* ==================== EDITORIAL CONTENT BANDS ==================== */}
          <section id="intelligence" className="pt-editorial-section">
            <div className="section-eyebrow">Taxonomy & Architecture</div>
            <h2 className="section-heading-sm">
              Deterministic categorization on verified ledgers.
            </h2>

            <div className="editorial-cards-grid">
              <div className="editorial-card">
                <div>
                  <div className="card-step-num">01 / INGESTION</div>
                  <h3 className="card-title">Drop Any Bank CSV</h3>
                  <p className="card-desc">
                    Chase, Amex, Apple Card, or local credit unions. Automated SHA-256 fingerprinting ensures duplicate charges are discarded in zero runtime cycles.
                  </p>
                </div>
              </div>

              <div className="editorial-card">
                <div>
                  <div className="card-step-num">02 / NATURAL SQL</div>
                  <h3 className="card-title">Ask in Plain English</h3>
                  <p className="card-desc">
                    Query your personal finances with conversational questions. Verified Abstract Syntax Trees guarantee SELECT-only deterministic math.
                  </p>
                </div>
              </div>

              <div id="security" className="editorial-card">
                <div>
                  <div className="card-step-num">03 / PRIVATE ENCLAVE</div>
                  <h3 className="card-title">100% Tenant Isolated</h3>
                  <p className="card-desc">
                    Your financial records belong exclusively to you. No behavioral tracking, zero third-party ads, and no selling your data to credit brokers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ==================== CLOSING CTA ==================== */}
          <section className="pt-cta-section">
            <div className="pt-cta-box">
              <h2 className="pt-cta-title">See your money clearly.</h2>
              <p className="pt-cta-sub">
                Join users who took control of their spending with FinSight. No credit card required to get started.
              </p>
              <button
                type="button"
                className="pt-btn-outlined-cta"
                style={{ padding: "14px 28px", fontSize: "14px" }}
                onClick={onGetStarted}
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        </main>

        {/* ==================== FOOTER ==================== */}
        <footer className="pt-footer">
          <div>FinSight · Personal Finance AI Tracker</div>
          <div>{currentTime ? `Local Time: ${currentTime}` : "Live Sync"} · Obsidian Enclave</div>
        </footer>
      </div>
    </div>
  );
}

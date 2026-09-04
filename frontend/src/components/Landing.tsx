import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Smartphone,
  Cpu,
  Search,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";
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
      duration: 1.15,
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
      hash: "sha256:7f9a2b...",
    },
    airline: {
      raw: "2026-02-28,DELTA AIR 0062819201824 ATLANTA GA TKT,-$382.40",
      cleanMerchant: "Delta Air Lines",
      category: "Travel & Flights",
      amount: "-$382.40",
      account: "Amex Platinum ···1004",
      confidence: "99.9% match",
      hash: "sha256:4c1e8d...",
    },
    software: {
      raw: "2026-02-26,GITHUB INC SPONSORS/SUB SAN FRANCISCO CA,-$21.00",
      cleanMerchant: "GitHub Developer",
      category: "Software & Subscriptions",
      amount: "-$21.00",
      account: "Apple Card ···7721",
      confidence: "100% match",
      hash: "sha256:9a3f01...",
    },
  };

  const currentSample = SAMPLES[activeSample];

  // Interactive Natural Query sample
  const [activeQuery, setActiveQuery] = useState<number>(0);
  const QUERIES = [
    {
      q: "How much did I spend on dining out last month?",
      summary: "$412.50 across 18 transactions",
      trend: "-12% vs previous month",
      sql: "SELECT SUM(amount) FROM txs WHERE category = 'Dining' AND date >= '2026-02-01';",
      confidence: "99.9%",
    },
    {
      q: "Find recurring software subscriptions higher than $15",
      summary: "3 subscriptions identified ($64.00/mo total)",
      trend: "GitHub ($21), Figma ($15), Linear ($28)",
      sql: "SELECT merchant, amount FROM txs WHERE is_recurring = TRUE AND amount > 15;",
      confidence: "100%",
    },
    {
      q: "What is my net savings velocity for Q1 2026?",
      summary: "+$3,480 saved (32.4% savings rate)",
      trend: "+4.2% above your target benchmark",
      sql: "SELECT (total_income - total_expenses) / total_income AS savings_rate FROM monthly_summary;",
      confidence: "99.8%",
    },
  ];

  return (
    <div className="pt-layout">
      {/* ==================== TOP NAVIGATION BAR (Full-Bleed Espresso Ink #1a0000) ==================== */}
      <div className="pt-nav-wrapper">
        <header className="pt-nav-bar">
          <div className="pt-nav-left">
            <a href="#" className="pt-logo">
              <span>FinSight</span>
              <span className="pt-logo-dot" />
            </a>

            <nav className="pt-nav-links" aria-label="Main Navigation">
              <a href="#ecosystem" className="pt-nav-ghost-btn">
                Ecosystem
              </a>
              <a href="#statements" className="pt-nav-ghost-btn">
                Refractor
              </a>
              <a href="#intelligence" className="pt-nav-ghost-btn">
                Natural SQL
              </a>
              <a href="#security" className="pt-nav-ghost-btn">
                Private Enclave
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
              className="pt-btn-nav-cta"
              onClick={onGetStarted}
            >
              <span>Get Started</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </header>
      </div>

      {/* ==================== HERO SECTION (Full-Bleed Prismatic Spectrum Gradient) ==================== */}
      <main>
        <section className="pt-hero-gradient-wrap">
          <div className="pt-hero-content">
            <div className="pt-hero-eyebrow">
              <span className="eyebrow-spark">✦</span>
              <span>Autonomous Intelligence · Multi-Currency Ledgers</span>
            </div>

            <h1 className="pt-hero-display-title">
              Your money,
              <br />
              understood.
            </h1>

            <p className="pt-hero-subtitle">
              Drop your bank statements. FinSight transforms messy transactions into crystal clear insights with zero spreadsheet headaches.
            </p>

            <div className="pt-hero-actions">
              <button
                type="button"
                className="pt-btn-hero-primary"
                onClick={onGetStarted}
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} />
              </button>
              <a href="#ecosystem" className="pt-btn-hero-secondary">
                <span>Explore Ecosystem</span>
              </a>
            </div>

            {/* HERO VISUAL SHOWCASE: 3D Iridescent Gemstones & Prismatic Core */}
            <div className="pt-hero-visual-wrapper">
              <div className="pt-hero-visual-card">
                <img
                  src="/images/fluz_hero_gems.jpg"
                  alt="FinSight 3D Prismatic Gemstone Core"
                  className="pt-hero-visual-image"
                />
                <div className="pt-hero-visual-glass-overlay">
                  <div className="hero-floating-chip left-chip">
                    <span className="chip-indicator" />
                    <div>
                      <div className="chip-label">AUTOMATIC DEDUPLICATION</div>
                      <div className="chip-val">SHA-256 Real-Time Reconciled</div>
                    </div>
                  </div>
                  <div className="hero-floating-chip right-chip">
                    <span className="chip-badge">99.9%</span>
                    <div>
                      <div className="chip-label">NEURAL ACCURACY</div>
                      <div className="chip-val">Zero Formula Headaches</div>
                    </div>
                  </div>
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

        {/* ==================== PRODUCT ECOSYSTEM SHOWCASE ==================== */}
        <section id="ecosystem" className="pt-ecosystem-section">
          <div className="pt-container">
            <div className="ecosystem-header">
              <div className="section-eyebrow">THE FINTECH ECOSYSTEM</div>
              <h2 className="section-heading-sm">
                Physical Security. Mobile Intelligence.
              </h2>
              <p className="section-desc">
                FinSight bridges tangible cryptographic hardware with autonomous natural language finance tracking.
              </p>
            </div>

            <div className="ecosystem-cards-grid">
              {/* Card 1: Matte Titanium Smart Card */}
              <div className="ecosystem-card">
                <div className="ecosystem-card-media">
                  <img
                    src="/images/fluz_card_mockup.jpg"
                    alt="FinSight Matte Titanium Smart Card"
                    className="ecosystem-img"
                  />
                  <span className="ecosystem-pill-tag">
                    <CreditCard size={12} />
                    <span>01 / HARDWARE ENCLAVE</span>
                  </span>
                </div>
                <div className="ecosystem-card-body">
                  <h3 className="ecosystem-card-title">Matte Titanium Member Card</h3>
                  <p className="ecosystem-card-text">
                    Laser-etched aerospace titanium key for encrypted multi-currency transactions. Offline cryptographic signature guarantees verified merchant ledgers with zero telemetry leakage.
                  </p>
                  <div className="ecosystem-meta-row">
                    <span className="meta-spec">99.8% Pure Titanium</span>
                    <span className="meta-spec">Contactless NFC / EMV</span>
                    <span className="meta-spec">Zero Logged Biometrics</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Mobile Intelligence In Hand */}
              <div className="ecosystem-card">
                <div className="ecosystem-card-media">
                  <img
                    src="/images/fluz_phone_app.jpg"
                    alt="FinSight Mobile Intelligence App"
                    className="ecosystem-img"
                  />
                  <span className="ecosystem-pill-tag">
                    <Smartphone size={12} />
                    <span>02 / MOBILE INTELLIGENCE</span>
                  </span>
                </div>
                <div className="ecosystem-card-body">
                  <h3 className="ecosystem-card-title">FinSight iOS & Android Enclave</h3>
                  <p className="ecosystem-card-text">
                    Photograph paper receipts or import digital bank PDFs on the fly. Real-time OCR categorizes merchant taxonomy in milliseconds, keeping your net worth synchronized wherever you go.
                  </p>
                  <div className="ecosystem-meta-row">
                    <span className="meta-spec">Instant Receipt OCR</span>
                    <span className="meta-spec">Local-First Vault</span>
                    <span className="meta-spec">Sub-Second Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STATEMENT TRANSFORMER (Card Mask Refractor) ==================== */}
        <section id="statements" className="pt-showcase-section">
          <div className="pt-container">
            <div className="pt-showcase-card">
              <div className="transformer-header">
                <div>
                  <div className="section-eyebrow">DETERMINISTIC REFRACTOR</div>
                  <h3 className="transformer-label">Instant Statement Ingestion</h3>
                </div>
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
                  <div className="raw-header">
                    <span>MESSY BANK EXPORT STRING</span>
                    <span className="raw-badge">INPUT</span>
                  </div>
                  <div className="raw-text">{currentSample.raw}</div>
                  <div className="raw-footer">
                    <span>Fingerprint:</span> <code>{currentSample.hash}</code>
                  </div>
                </div>

                {/* Transformer Arrow */}
                <div className="transformer-arrow">
                  <ArrowRight size={18} />
                </div>

                {/* Refracted Output Card */}
                <div className="cleaned-card-box">
                  <div className="cleaned-header">
                    <span className="cleaned-cat-badge">
                      <Sparkles size={12} />
                      <span>{currentSample.category}</span>
                    </span>
                    <span className="cleaned-amount">{currentSample.amount}</span>
                  </div>
                  <div className="cleaned-merchant">{currentSample.cleanMerchant}</div>
                  <div className="cleaned-meta">
                    <span>{currentSample.account}</span>
                    <span className="meta-sep">·</span>
                    <span className="confidence-pill">{currentSample.confidence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== NATURAL LANGUAGE QUERY PLAYGROUND ==================== */}
        <section id="intelligence" className="pt-query-section">
          <div className="pt-container">
            <div className="query-layout-box">
              <div className="query-left">
                <div className="section-eyebrow">NATURAL SQL INTELLIGENCE</div>
                <h2 className="section-heading-sm">
                  Ask financial questions in everyday English.
                </h2>
                <p className="section-desc">
                  No complex spreadsheet formulas or pivot tables. Inquire naturally about your burn rate, dining trends, or recurring subscriptions.
                </p>

                <div className="query-samples-list">
                  {QUERIES.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`query-item-btn ${activeQuery === idx ? "active" : ""}`}
                      onClick={() => setActiveQuery(idx)}
                    >
                      <Search size={14} className="query-icon" />
                      <span>"{item.q}"</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="query-right">
                <div className="terminal-card">
                  <div className="terminal-top">
                    <div className="terminal-dots">
                      <span className="t-dot red" />
                      <span className="t-dot yellow" />
                      <span className="t-dot green" />
                    </div>
                    <span className="terminal-title">FinSight Neural SQL Engine</span>
                    <span className="terminal-status">
                      <span className="live-dot" />
                      <span>Active</span>
                    </span>
                  </div>

                  <div className="terminal-body">
                    <div className="t-user-prompt">
                      <span className="t-prompt-symbol">&gt;</span>
                      <span className="t-prompt-text">"{QUERIES[activeQuery].q}"</span>
                    </div>

                    <div className="t-sql-box">
                      <div className="t-sql-label">GENERATED SQL QUERY</div>
                      <code className="t-sql-code">{QUERIES[activeQuery].sql}</code>
                    </div>

                    <div className="t-result-card">
                      <div className="t-result-header">
                        <span className="t-result-title">VERIFIED ANSWER</span>
                        <span className="t-confidence-tag">
                          <CheckCircle2 size={12} />
                          <span>{QUERIES[activeQuery].confidence} verified</span>
                        </span>
                      </div>
                      <div className="t-summary-stat">{QUERIES[activeQuery].summary}</div>
                      <div className="t-trend-desc">{QUERIES[activeQuery].trend}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 3-COLUMN FEATURE PILLARS ==================== */}
        <section id="security" className="pt-feature-section">
          <div className="pt-container">
            <div className="section-eyebrow">PRODUCT PILLARS</div>
            <h2 className="section-heading-sm">
              How FinSight organizes your life.
            </h2>

            <div className="editorial-cards-grid">
              <div className="editorial-card">
                <div className="card-top-icon">
                  <Layers size={22} />
                </div>
                <div className="card-step-num">01 / INGESTION</div>
                <h3 className="card-title">Drop Any Bank CSV</h3>
                <p className="card-desc">
                  Chase, Amex, Apple Card, or local credit unions. Automated SHA-256 fingerprinting ensures duplicate charges are discarded in zero runtime cycles.
                </p>
              </div>

              <div className="editorial-card">
                <div className="card-top-icon">
                  <Cpu size={22} />
                </div>
                <div className="card-step-num">02 / NATURAL SQL</div>
                <h3 className="card-title">Deterministic Math</h3>
                <p className="card-desc">
                  No hallucinated numbers or fuzzy estimates. Every answer maps directly to verifiable database rows with complete audit logs and category tags.
                </p>
              </div>

              <div className="editorial-card">
                <div className="card-top-icon">
                  <Lock size={22} />
                </div>
                <div className="card-step-num">03 / PRIVATE ENCLAVE</div>
                <h3 className="card-title">100% Tenant Isolated</h3>
                <p className="card-desc">
                  Your financial records belong exclusively to you. No behavioral tracking, zero third-party ads, and no selling your personal data to credit card brokers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CLOSING CTA ==================== */}
        <section className="pt-cta-section">
          <div className="pt-container">
            <div className="pt-cta-box">
              <div className="section-eyebrow">GET STARTED TODAY</div>
              <h2 className="pt-cta-title">See your money clearly.</h2>
              <p className="pt-cta-sub">
                Join users who took control of their spending with FinSight. No credit card required to get started.
              </p>
              <div className="cta-buttons-row">
                <button
                  type="button"
                  className="pt-btn-hero-primary"
                  onClick={onGetStarted}
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="pt-btn-hero-secondary dark-secondary"
                  onClick={onSignIn}
                >
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="pt-footer">
        <div className="pt-container footer-content">
          <div className="footer-left">
            <div className="footer-brand">FinSight</div>
            <p className="footer-tagline">Autonomous Multi-Currency Personal Finance Tracker</p>
          </div>
          <div className="footer-right">
            <span>{currentTime ? `Local System: ${currentTime}` : "Live Sync"}</span>
            <span className="footer-sep">·</span>
            <span>Fluz Editorial Direction</span>
            <span className="footer-sep">·</span>
            <span>Zero Tracking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

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
  Shield,
  Zap,
  Sliders,
  Ban,
  HelpCircle,
} from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./landing/landing.css";
import { CustomCursor } from "./landing/CustomCursor";
import { InfiniteShowcaseCarousel } from "./landing/InfiniteShowcaseCarousel";
import { EditorialMenuOverlay } from "./landing/EditorialMenuOverlay";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

type Segment = "personal" | "business" | "platform";

export function Landing({ onGetStarted, onSignIn }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Fluz Segment Switcher: Personal | Business | Platform
  const [activeSegment, setActiveSegment] = useState<Segment>("personal");

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

  // Interactive Natural Query sample for Platform & Intelligence
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
    <div className="fluz-site-layout">
      {/* Precision Modern Liquid Cursor */}
      <CustomCursor />

      {/* Full-Screen Editorial Menu Overlay with dynamic link previews */}
      <EditorialMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGetStarted={onGetStarted}
        onSignIn={onSignIn}
      />

      {/* ==================== DUAL-TIER TOP NAVIGATION ==================== */}
      <div className="fluz-nav-wrapper">
        {/* Sub-strip (Fluz Money / Marketplace / Blog row) */}
        <div className="fluz-sub-bar">
          <div className="fluz-container fluz-sub-bar-inner">
            <div className="fluz-sub-tabs">
              <span className="fluz-sub-tab active">
                Money
                <span className="fluz-sub-tab-indicator" />
              </span>
              <a href="#explore" className="fluz-sub-tab">
                Intelligence
              </a>
              <a href="#trust" className="fluz-sub-tab">
                Security Enclave
              </a>
            </div>

            <div className="fluz-sub-meta">
              <span className="live-dot" />
              <span>{currentTime ? `Live Sync · ${currentTime}` : "Live Reconciled"}</span>
            </div>
          </div>
        </div>

        {/* Main Sticky Header */}
        <header className="fluz-header">
          <div className="fluz-container fluz-header-inner">
            <div className="fluz-header-left">
              <a href="#" className="fluz-wordmark">
                <span>FinSight</span>
                <span className="fluz-logo-dot" />
              </a>

              <nav className="fluz-nav-links" aria-label="Main Navigation">
                <button
                  type="button"
                  className={`fluz-nav-tab ${activeSegment === "personal" ? "active" : ""}`}
                  onClick={() => setActiveSegment("personal")}
                >
                  Personal
                </button>
                <button
                  type="button"
                  className={`fluz-nav-tab ${activeSegment === "business" ? "active" : ""}`}
                  onClick={() => setActiveSegment("business")}
                >
                  Business
                </button>
                <button
                  type="button"
                  className={`fluz-nav-tab ${activeSegment === "platform" ? "active" : ""}`}
                  onClick={() => setActiveSegment("platform")}
                >
                  Platform
                </button>
                <a href="#trust" className="fluz-nav-tab">
                  Security
                </a>
              </nav>
            </div>

            <div className="fluz-header-right">
              <button
                type="button"
                className="fluz-search-trigger"
                onClick={onSignIn}
                title="Search ledger"
              >
                <Search size={15} />
                <span>Search</span>
              </button>

              <div className="fluz-header-divider" />

              <button
                type="button"
                className="fluz-btn-help"
                onClick={onSignIn}
                title="Support and Help"
                aria-label="Support"
              >
                <HelpCircle size={17} />
              </button>

              <button
                type="button"
                className="fluz-btn-login"
                onClick={onSignIn}
              >
                Log In
              </button>

              <button
                type="button"
                className="fluz-btn-cta-pill"
                onClick={onGetStarted}
                data-cursor="START"
              >
                <span>Get Started</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                type="button"
                className="fluz-btn-menu-trigger"
                onClick={() => setIsMenuOpen(true)}
                data-cursor="MENU"
                title="Open Editorial Navigation"
              >
                <span className="menu-burger-bars">
                  <span className="burger-bar" />
                  <span className="burger-bar" />
                </span>
                <span className="menu-burger-label">MENU</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      <main>
        {/* ==================== HERO SECTION: FLUZ 3-LINE DISPLAY & FLOATING CUTOUTS ==================== */}
        <section className="fluz-hero-section">
          {/* Floating Transparent Gemstone & Butterfly Cutouts (Direct from Fluz reference) */}
          <div className="fluz-cutout-wrap gem-pos-top-left" aria-hidden="true">
            <img
              src="/images/fluz_gem_1.png"
              alt=""
              className="fluz-cutout-img gem-drift-1"
            />
          </div>

          <div className="fluz-cutout-wrap butterfly-pos-top-left" aria-hidden="true">
            <img
              src="/images/fluz_butterfly_1.png"
              alt=""
              className="fluz-cutout-img butterfly-drift-1"
            />
          </div>

          <div className="fluz-cutout-wrap gem-pos-top-right" aria-hidden="true">
            <img
              src="/images/fluz_gem_alt.png"
              alt=""
              className="fluz-cutout-img gem-drift-2"
            />
          </div>

          <div className="fluz-cutout-wrap butterfly-pos-mid-right" aria-hidden="true">
            <img
              src="/images/fluz_butterfly_2.png"
              alt=""
              className="fluz-cutout-img butterfly-drift-2"
            />
          </div>

          <div className="fluz-cutout-wrap gem-pos-mid-left" aria-hidden="true">
            <img
              src="/images/fluz_gem_alt.png"
              alt=""
              className="fluz-cutout-img gem-drift-3"
            />
          </div>

          <div className="fluz-cutout-wrap butterfly-pos-bottom-right" aria-hidden="true">
            <img
              src="/images/fluz_butterfly_3.png"
              alt=""
              className="fluz-cutout-img butterfly-drift-3"
            />
          </div>

          <div className="fluz-cutout-wrap gem-pos-bottom-center" aria-hidden="true">
            <img
              src="/images/fluz_gem_1.png"
              alt=""
              className="fluz-cutout-img gem-drift-4"
            />
          </div>

          <div className="fluz-container fluz-hero-content">
            <div className="fluz-hero-eyebrow">
              <span className="eyebrow-spark">✦</span>
              <span>Autonomous Intelligence · Multi-Currency Ledgers</span>
            </div>

            {/* Monumental 3-Line Stacked Headline from Fluz */}
            <div className="fluz-hero-title-group">
              <h1 className="fluz-hero-display-line">YOUR</h1>
              <h1 className="fluz-hero-display-line">MONEY</h1>
              <h1 className="fluz-hero-display-line">ON MAX.</h1>
            </div>

            <p className="fluz-hero-subline">
              One platform to optimize how money moves in your world.
            </p>

            <div className="fluz-hero-actions">
              <button
                type="button"
                className="fluz-btn-hero-primary"
                onClick={onGetStarted}
              >
                <span>Get started free</span>
                <ArrowRight size={15} />
              </button>
              <a href="#explore" className="fluz-btn-hero-secondary">
                <span>See how it works</span>
              </a>
            </div>
          </div>
        </section>

        {/* ==================== INFINITE TICKER MARQUEE ==================== */}
        <div className="fluz-marquee-wrap" aria-hidden="true">
          <div className="fluz-marquee-track">
            <div className="fluz-marquee-item">
              <span>RECONCILE STATEMENTS</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>ASK IN PLAIN ENGLISH</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>ZERO SPREADSHEETS</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>100% PRIVATE ENCLAVE</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>DETERMINISTIC MATH</span>
              <span className="fluz-marquee-dot">✦</span>
            </div>
            <div className="fluz-marquee-item">
              <span>RECONCILE STATEMENTS</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>ASK IN PLAIN ENGLISH</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>ZERO SPREADSHEETS</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>100% PRIVATE ENCLAVE</span>
              <span className="fluz-marquee-dot">✦</span>
              <span>DETERMINISTIC MATH</span>
              <span className="fluz-marquee-dot">✦</span>
            </div>
          </div>
        </div>

        {/* ==================== SEGMENT SWITCHER & 4-CARD PRODUCT GRID ==================== */}
        <section id="explore" className="fluz-products-section">
          <div className="fluz-container">
            <div className="fluz-section-header">
              <div className="fluz-eyebrow">THE FINTECH ECOSYSTEM</div>
              <h2 className="fluz-heading">
                One platform to optimize how money moves.
              </h2>

              {/* Segment Pill Switcher (Personal | Business | Platform) */}
              <div className="fluz-segment-bar">
                <button
                  type="button"
                  className={`fluz-segment-pill ${activeSegment === "personal" ? "active" : ""}`}
                  onClick={() => setActiveSegment("personal")}
                >
                  Personal
                </button>
                <button
                  type="button"
                  className={`fluz-segment-pill ${activeSegment === "business" ? "active" : ""}`}
                  onClick={() => setActiveSegment("business")}
                >
                  Business
                </button>
                <button
                  type="button"
                  className={`fluz-segment-pill ${activeSegment === "platform" ? "active" : ""}`}
                  onClick={() => setActiveSegment("platform")}
                >
                  Platform
                </button>
              </div>
            </div>

            {/* Dynamic 4-Card Modular Showcase Grid */}
            <div className="fluz-cards-grid">
              {/* Card 1: Virtual & Physical Cards */}
              <div className="fluz-card">
                <div className="fluz-card-media">
                  <img
                    src="/images/fluz_card_mockup.jpg"
                    alt="FinSight Titanium Card"
                    className="fluz-card-img"
                  />
                  <span className="fluz-card-badge">
                    <CreditCard size={12} />
                    <span>01 / CARDS &amp; CONTROLS</span>
                  </span>
                </div>
                <div className="fluz-card-body">
                  <h3 className="fluz-card-title">
                    {activeSegment === "personal" && "Create cards with built-in budgets and control."}
                    {activeSegment === "business" && "Issue virtual corporate cards with per-merchant limits."}
                    {activeSegment === "platform" && "Programmable card issuing with deterministic webhooks."}
                  </h3>
                  <p className="fluz-card-desc">
                    {activeSegment === "personal" &&
                      "Define spending limits, restrict categories, and turn cards on or off instantly. Offline cryptographic key guarantees private transactions."}
                    {activeSegment === "business" &&
                      "Provision virtual cards for contractors and SaaS vendors. Restrict monthly budgets, freeze cards automatically upon limit hit."}
                    {activeSegment === "platform" &&
                      "Direct API integration for automated provisioning, tenant isolation, and cryptographic transaction signing."}
                  </p>
                  <div className="fluz-card-specs">
                    <span className="spec-tag">Instant Freeze</span>
                    <span className="spec-tag">Category Locks</span>
                    <span className="spec-tag">Zero Telemetry</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Mobile Intelligence on the Go */}
              <div className="fluz-card">
                <div className="fluz-card-media">
                  <img
                    src="/images/fluz_phone_app.jpg"
                    alt="FinSight Mobile Intelligence"
                    className="fluz-card-img"
                  />
                  <span className="fluz-card-badge">
                    <Smartphone size={12} />
                    <span>02 / MOBILE INTELLIGENCE</span>
                  </span>
                </div>
                <div className="fluz-card-body">
                  <h3 className="fluz-card-title">
                    {activeSegment === "personal" && "Snap receipts and track spending velocity anywhere."}
                    {activeSegment === "business" && "Mobile expense approval and receipt matching for teams."}
                    {activeSegment === "platform" && "Sub-second sync with local-first encrypted SQLite cache."}
                  </h3>
                  <p className="fluz-card-desc">
                    {activeSegment === "personal" &&
                      "Photograph paper receipts or upload PDF statements. Sub-second OCR auto-categorizes your transactions into audited ledgers."}
                    {activeSegment === "business" &&
                      "Employees submit receipts instantly from their phone. FinSight matches them with pending bank charges automatically."}
                    {activeSegment === "platform" &&
                      "Bi-directional sync protocols keep edge clients synchronized with zero latency and complete offline capability."}
                  </p>
                  <div className="fluz-card-specs">
                    <span className="spec-tag">Real-Time OCR</span>
                    <span className="spec-tag">Sub-Second Sync</span>
                    <span className="spec-tag">Local Vault</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Natural Language SQL Intelligence */}
              <div className="fluz-card">
                <div className="fluz-card-media dark-media">
                  <div className="terminal-mini-preview">
                    <div className="mini-term-header">
                      <span className="term-indicator" />
                      <span>FinSight Neural SQL Engine</span>
                    </div>
                    <div className="mini-term-content">
                      <div className="mini-term-prompt">&gt; "{QUERIES[activeQuery].q}"</div>
                      <div className="mini-term-sql">{QUERIES[activeQuery].sql}</div>
                      <div className="mini-term-result">{QUERIES[activeQuery].summary} ({QUERIES[activeQuery].confidence} verified)</div>
                    </div>
                  </div>
                  <span className="fluz-card-badge">
                    <Cpu size={12} />
                    <span>03 / NATURAL SQL ENGINE</span>
                  </span>
                </div>
                <div className="fluz-card-body">
                  <h3 className="fluz-card-title">
                    {activeSegment === "personal" && "Ask financial questions in plain everyday English."}
                    {activeSegment === "business" && "Instant runway, burn rate, and vendor cost audits."}
                    {activeSegment === "platform" && "Verified SQL compilation with zero mathematical hallucination."}
                  </h3>
                  <p className="fluz-card-desc">
                    No spreadsheet formulas or pivot tables required. Inquire naturally about your expenses and get deterministic answers backed by raw ledger records.
                  </p>
                  <div className="fluz-query-quick-toggles">
                    {QUERIES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`query-mini-tab ${activeQuery === idx ? "active" : ""}`}
                        onClick={() => setActiveQuery(idx)}
                      >
                        Query {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: Dedicated Shared Accounts & Private Enclaves */}
              <div className="fluz-card">
                <div className="fluz-card-media gradient-media">
                  <div className="vault-visual-content">
                    <div className="vault-icon-circle">
                      <Shield size={32} />
                    </div>
                    <div className="vault-tag">100% TENANT ISOLATED</div>
                    <div className="vault-stat">256-Bit AES Encryption</div>
                  </div>
                  <span className="fluz-card-badge">
                    <Lock size={12} />
                    <span>04 / DEDICATED ACCOUNTS</span>
                  </span>
                </div>
                <div className="fluz-card-body">
                  <h3 className="fluz-card-title">
                    {activeSegment === "personal" && "Create dedicated accounts built for private sharing."}
                    {activeSegment === "business" && "Role-based vaults for department and project budgets."}
                    {activeSegment === "platform" && "Multi-tenant cryptographic data isolation by design."}
                  </h3>
                  <p className="fluz-card-desc">
                    Share household or team budgets with clear permissions and real-time visibility. Your financial data is never aggregated, profiled, or sold.
                  </p>
                  <div className="fluz-card-specs">
                    <span className="spec-tag">Multi-User</span>
                    <span className="spec-tag">Role Permissions</span>
                    <span className="spec-tag">Zero Ads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== INFINITE 3D CAROUSEL (Continuous Visual Architecture) ==================== */}
        <InfiniteShowcaseCarousel onSelectCard={onGetStarted} />

        {/* ==================== INTERACTIVE STATEMENT TRANSFORMER ==================== */}
        <section className="fluz-transformer-section">
          <div className="fluz-container">
            <div className="fluz-transformer-box">
              <div className="transformer-top-row">
                <div>
                  <div className="fluz-eyebrow">DETERMINISTIC INGESTION</div>
                  <h3 className="transformer-headline">Live Statement Refractor</h3>
                </div>

                <div className="transformer-sample-tabs">
                  <button
                    type="button"
                    className={`tr-tab ${activeSample === "coffee" ? "active" : ""}`}
                    onClick={() => setActiveSample("coffee")}
                  >
                    Coffee Purchase
                  </button>
                  <button
                    type="button"
                    className={`tr-tab ${activeSample === "airline" ? "active" : ""}`}
                    onClick={() => setActiveSample("airline")}
                  >
                    Flight Ticket
                  </button>
                  <button
                    type="button"
                    className={`tr-tab ${activeSample === "software" ? "active" : ""}`}
                    onClick={() => setActiveSample("software")}
                  >
                    SaaS Subscription
                  </button>
                </div>
              </div>

              <div className="transformer-demo-grid">
                <div className="demo-box raw-input">
                  <div className="demo-box-label">
                    <span>MESSY BANK EXPORT STRING</span>
                    <span className="badge-input">RAW INPUT</span>
                  </div>
                  <div className="raw-code-display">{currentSample.raw}</div>
                  <div className="demo-box-meta">
                    <span>Fingerprint:</span> <code>{currentSample.hash}</code>
                  </div>
                </div>

                <div className="demo-arrow">
                  <ArrowRight size={20} />
                </div>

                <div className="demo-box cleaned-output">
                  <div className="demo-box-label">
                    <span className="cat-pill">
                      <Sparkles size={11} />
                      <span>{currentSample.category}</span>
                    </span>
                    <span className="amount-stat">{currentSample.amount}</span>
                  </div>
                  <div className="merchant-title">{currentSample.cleanMerchant}</div>
                  <div className="demo-box-meta">
                    <span>{currentSample.account}</span>
                    <span className="sep-dot">·</span>
                    <span className="conf-pill">{currentSample.confidence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CONTROL & INTEGRATION SPLIT (Fluz Layout) ==================== */}
        <section className="fluz-control-section">
          <div className="fluz-container">
            <div className="fluz-control-grid">
              {/* Box 1: Designed to keep you in control */}
              <div className="fluz-control-box">
                <div className="control-icon-wrap">
                  <Sliders size={24} />
                </div>
                <h3 className="control-title">Designed to keep you in control</h3>
                <p className="control-text">
                  Define spending thresholds, tag tax deductions, and turn accounts on or off with a single click. You maintain complete sovereignty over your transactions.
                </p>
                <div className="control-checklist">
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Per-category spend caps</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Automated anomaly detection</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Instant CSV &amp; PDF ledger export</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Built to fit how you already do things */}
              <div className="fluz-control-box">
                <div className="control-icon-wrap">
                  <Zap size={24} />
                </div>
                <h3 className="control-title">Built to fit how you already do things</h3>
                <p className="control-text">
                  FinSight is engineered to fit into your existing financial habits. Works alongside your current bank accounts and credit cards with zero workflow disruption.
                </p>
                <div className="control-checklist">
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Drag and drop any bank CSV or OFX</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Multi-currency conversion at spot rates</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={16} className="check-icon" />
                    <span>Works alongside Chase, Amex, Apple Card &amp; more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== "WHY CHOOSE FINSIGHT?" & TRIPWIRE FREE ==================== */}
        <section id="trust" className="fluz-trust-section">
          <div className="fluz-container">
            <div className="fluz-section-header text-center">
              <div className="fluz-eyebrow">UNCOMPROMISING ARCHITECTURE</div>
              <h2 className="fluz-heading">Why choose FinSight?</h2>
            </div>

            <div className="fluz-trust-cards-grid">
              {/* Trust Card 1: More secure than ever */}
              <div className="fluz-trust-card">
                <div className="trust-icon-box">
                  <Shield size={24} />
                </div>
                <h3 className="trust-title">More secure than ever</h3>
                <p className="trust-desc">
                  FinSight uses bank-grade controls and regulated enclave infrastructure to protect your transaction records across real-world payment flows.
                </p>
                <div className="trust-pills-row">
                  <span className="trust-pill">AES-256 At Rest</span>
                  <span className="trust-pill">Tenant Isolated</span>
                  <span className="trust-pill">TLS 1.3 Transport</span>
                </div>
              </div>

              {/* Trust Card 2: Tripwire Free */}
              <div className="fluz-trust-card">
                <div className="trust-icon-box">
                  <Ban size={24} />
                </div>
                <h3 className="trust-title">Tripwire free</h3>
                <p className="trust-desc">
                  No need to switch banks, pass invasive credit checks, or worry about surprise fees. And we will never sell or monetize your personal transaction telemetry.
                </p>
                <div className="trust-pills-row">
                  <span className="trust-pill">No Bank Switching</span>
                  <span className="trust-pill">Zero Credit Checks</span>
                  <span className="trust-pill">No Ad Trackers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CLOSING CTA: YOUR MONEY ON MAX ==================== */}
        <section className="fluz-cta-section">
          <div className="fluz-container">
            <div className="fluz-cta-box">
              <div className="fluz-eyebrow">READY TO TAKE CONTROL?</div>
              <h2 className="fluz-cta-headline">YOUR MONEY ON MAX.</h2>
              <p className="fluz-cta-subline">
                FinSight is free to join and open to everyone. Sign up today and start optimizing how money moves in your world.
              </p>
              <div className="fluz-cta-buttons">
                <button
                  type="button"
                  className="fluz-btn-hero-primary"
                  onClick={onGetStarted}
                >
                  <span>Get started free</span>
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="fluz-btn-hero-secondary dark-secondary"
                  onClick={onSignIn}
                >
                  <span>Log in</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="fluz-footer">
        <div className="fluz-container fluz-footer-inner">
          <div className="footer-left">
            <div className="footer-logo">FinSight</div>
            <p className="footer-tagline">
              Autonomous Multi-Currency Personal Finance Tracker · Fluz Design Standard
            </p>
          </div>

          <div className="footer-right">
            <span>{currentTime ? `System Time: ${currentTime}` : "Real-Time Sync"}</span>
            <span className="footer-bullet">✦</span>
            <span>Zero Tracking</span>
            <span className="footer-bullet">✦</span>
            <span>Tenant Enclave Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

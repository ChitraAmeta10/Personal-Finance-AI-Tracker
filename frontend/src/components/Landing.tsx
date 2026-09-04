import { useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CustomCursor } from "./landing/CustomCursor";
import { EditorialMenuOverlay } from "./landing/EditorialMenuOverlay";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSample, setActiveSample] = useState<"coffee" | "airline" | "software">("coffee");
  const [activeQuery, setActiveQuery] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [scrollY, setScrollY] = useState<number>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const SAMPLES = {
    coffee: {
      raw: "2026-03-01,POS DEBIT SQ *BLUE BOTTLE COFFEE #104 SAN FRANCISCO CA,-$6.50",
      cleanMerchant: "Blue Bottle Coffee",
      category: "Dining & Coffee",
      amount: "-$6.50",
      account: "Chase Sapphire ···4892",
      confidence: "99.8% match",
      hash: "sha256:7f9a2b0c1e8d4a3f9b2c8e1a7d6f5c4b",
    },
    airline: {
      raw: "2026-02-28,DELTA AIR 0062819201824 ATLANTA GA TKT,-$382.40",
      cleanMerchant: "Delta Air Lines",
      category: "Travel & Flights",
      amount: "-$382.40",
      account: "Amex Platinum ···1004",
      confidence: "99.9% match",
      hash: "sha256:4c1e8d7f9a2b0c1e8d4a3f9b2c8e1a7d",
    },
    software: {
      raw: "2026-02-26,GITHUB INC SPONSORS/SUB SAN FRANCISCO CA,-$21.00",
      cleanMerchant: "GitHub Developer",
      category: "Software & Subscriptions",
      amount: "-$21.00",
      account: "Apple Card ···7721",
      confidence: "100% match",
      hash: "sha256:9a3f01c4e8b2d7f9a2b0c1e8d4a3f9b2",
    },
  };

  const currentSample = SAMPLES[activeSample];

  const QUERIES = [
    {
      q: "How much did I spend on dining out last month?",
      summary: "$412.50 across 18 transactions",
      trend: "-12% vs previous benchmark",
      sql: "SELECT SUM(amount) FROM ledger WHERE category = 'Dining' AND date >= '2026-02-01';",
      confidence: "Deterministic 99.9%",
    },
    {
      q: "Find recurring software subscriptions higher than $15",
      summary: "3 active services ($64.00/mo total)",
      trend: "GitHub ($21), Figma ($15), Linear ($28)",
      sql: "SELECT merchant, amount FROM ledger WHERE is_recurring = TRUE AND amount > 15;",
      confidence: "Deterministic 100%",
    },
    {
      q: "What is my net savings velocity for Q1 2026?",
      summary: "+$3,480 saved (32.4% savings rate)",
      trend: "+4.2% above target allocation",
      sql: "SELECT (total_income - total_expenses) / total_income AS savings_rate FROM monthly_ledger;",
      confidence: "Deterministic 99.8%",
    },
  ];

  // Unified optical parallax (smooth vertical displacement with subtle 3D perspective tilt)
  const wrapTransform = `translate3d(calc(-50% + ${mousePos.x * 12}px), calc(-50% + ${scrollY * 0.22}px + ${mousePos.y * 12}px), 0) rotateX(${Math.min(scrollY * 0.012, 8)}deg) rotateY(${mousePos.x * 5}deg)`;

  // Subtle depth-of-field parallax for individual glass facets (no unnatural spinning)
  const cube1Transform = `translate3d(0, ${scrollY * 0.08}px, 0)`;
  const cube2Transform = `translate3d(${scrollY * 0.04}px, ${-scrollY * 0.03}px, 0)`;
  const cube3Transform = `translate3d(${-scrollY * 0.05}px, ${scrollY * 0.14}px, 0)`;
  const cube4Transform = `translate3d(${-scrollY * 0.03}px, ${-scrollY * 0.05}px, 0)`;
  const cube5Transform = `translate3d(${scrollY * 0.06}px, ${scrollY * 0.07}px, 0)`;
  const causticsTransform = `translate3d(${scrollY * 0.04}px, 0, 0) scale(${1 + Math.min(scrollY, 600) * 0.0003})`;

  return (
    <div className="vivid-site-layout">
      {/* Precision Liquid Cursor */}
      <CustomCursor />

      {/* Full-Screen Editorial Menu Overlay */}
      <EditorialMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onGetStarted={onGetStarted}
        onSignIn={onSignIn}
      />

      {/* ==================== GHOST NAVIGATION ==================== */}
      <header className="vivid-header">
        <div className="vivid-container vivid-header-inner">
          <a href="#" className="vivid-wordmark" data-cursor="HOME">
            <span className="vivid-prism-pip" aria-hidden="true" />
            <span>FinSight</span>
          </a>

          <nav className="vivid-nav-links" aria-label="Primary Navigation">
            <a href="#ingestion" className="vivid-ghost-nav-link" data-cursor="VIEW">
              Ingestion
            </a>
            <a href="#intelligence" className="vivid-ghost-nav-link" data-cursor="VIEW">
              Deterministic SQL
            </a>
            <a href="#enclave" className="vivid-ghost-nav-link" data-cursor="VIEW">
              Architecture
            </a>
          </nav>

          <div className="vivid-header-actions">
            <button
              type="button"
              className="vivid-ghost-nav-link"
              onClick={onSignIn}
              data-cursor="LOGIN"
            >
              Sign In
            </button>

            {/* Outlined Contact Button: The only bordered element in header */}
            <button
              type="button"
              className="vivid-btn-outlined-contact"
              onClick={onGetStarted}
              data-cursor="ACCESS"
            >
              <span>Get Started</span>
              <ArrowUpRight size={14} />
            </button>

            <button
              type="button"
              className="vivid-menu-toggle"
              onClick={() => setIsMenuOpen(true)}
              data-cursor="MENU"
              aria-label="Open Navigation"
            >
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ==================== HERO VOID & SIGNATURE PRISM ==================== */}
        <section className="vivid-hero-section">
          {/* Signature 3D Chromatic Dispersion Glass Cubes Artwork with Multi-Layer Parallax */}
          <div
            className="vivid-prism-canvas-wrap"
            aria-hidden="true"
            style={{ transform: wrapTransform }}
          >
            <svg
              className="vivid-prism-svg"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="prismGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a7fff" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#101010" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff2a2a" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="prismGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2aff2a" stopOpacity="0.7" />
                  <stop offset="60%" stopColor="#101010" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2a7fff" stopOpacity="0.8" />
                </linearGradient>
                <filter id="chromaticGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="24" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Staggered glass cubes with RGB channel dispersion */}
              <g filter="url(#chromaticGlow)">
                {/* Back dispersion refraction aura & light beams */}
                <g className="prism-caustics-layer" style={{ transform: causticsTransform }}>
                  <ellipse cx="300" cy="300" rx="230" ry="170" fill="url(#prismGrad1)" opacity="0.26" />
                  <ellipse cx="320" cy="280" rx="180" ry="130" fill="url(#prismGrad2)" opacity="0.2" />
                  <line x1="90" y1="180" x2="510" y2="440" stroke="#2a7fff" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="6 12" />
                  <line x1="110" y1="170" x2="530" y2="430" stroke="#ff2a2a" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 8" />
                </g>

                {/* Cube 4 (Upper Left Floating Satellite Shard) */}
                <g className="prism-cube-layer prism-cube-4" style={{ transform: cube4Transform }}>
                  <polygon points="160,130 210,160 160,190 110,160" fill="#12171d" stroke="#fffdf9" strokeWidth="0.4" strokeOpacity="0.6" />
                  <polygon points="110,160 160,190 160,240 110,210" fill="#090d12" stroke="#2a7fff" strokeWidth="0.8" strokeOpacity="0.8" />
                  <polygon points="160,190 210,160 210,210 160,240" fill="#0d090b" stroke="#ff2a2a" strokeWidth="0.8" strokeOpacity="0.8" />
                </g>

                {/* Cube 5 (Upper Right Distant Refraction Shard) */}
                <g className="prism-cube-layer prism-cube-5" style={{ transform: cube5Transform }}>
                  <polygon points="480,140 530,170 480,200 430,170" fill="#141a16" stroke="#fffdf9" strokeWidth="0.4" strokeOpacity="0.6" />
                  <polygon points="430,170 480,200 480,250 430,220" fill="#0b120d" stroke="#2aff2a" strokeWidth="0.8" strokeOpacity="0.8" />
                  <polygon points="480,200 530,170 530,220 480,250" fill="#090d12" stroke="#2a7fff" strokeWidth="0.8" strokeOpacity="0.8" />
                </g>
                
                {/* Cube 1 (Central Major Isometric Glass Cube) */}
                <g className="prism-cube-layer prism-cube-1" style={{ transform: cube1Transform }}>
                  <polygon points="300,160 410,225 300,290 190,225" fill="#181e24" stroke="#fffdf9" strokeWidth="0.75" strokeOpacity="0.8" />
                  <polygon points="190,225 300,290 300,420 190,355" fill="#0c0e12" stroke="#2a7fff" strokeWidth="1.2" strokeOpacity="0.9" />
                  <polygon points="300,290 410,225 410,355 300,420" fill="#120d0f" stroke="#ff2a2a" strokeWidth="1.2" strokeOpacity="0.9" />
                </g>

                {/* Cube 2 (Offset Floating Glass Accent) */}
                <g className="prism-cube-layer prism-cube-2" style={{ transform: cube2Transform }}>
                  <polygon points="420,290 490,330 420,370 350,330" fill="#141920" stroke="#fffdf9" strokeWidth="0.5" strokeOpacity="0.6" />
                  <polygon points="350,330 420,370 420,440 350,400" fill="#0e1410" stroke="#2aff2a" strokeWidth="1" strokeOpacity="0.85" />
                  <polygon points="420,370 490,330 490,400 420,440" fill="#160e10" stroke="#ff2a2a" strokeWidth="1" strokeOpacity="0.85" />
                </g>

                {/* Cube 3 (Foreground Minimal Glass Shard) */}
                <g className="prism-cube-layer prism-cube-3" style={{ transform: cube3Transform }}>
                  <polygon points="210,320 270,355 210,390 150,355" fill="#181e26" stroke="#fffdf9" strokeWidth="0.5" strokeOpacity="0.7" />
                  <polygon points="150,355 210,390 210,455 150,420" fill="#0d1117" stroke="#2a7fff" strokeWidth="1" strokeOpacity="0.9" />
                  <polygon points="210,390 270,355 270,420 210,455" fill="#0c1410" stroke="#2aff2a" strokeWidth="1" strokeOpacity="0.9" />
                </g>
              </g>
            </svg>
          </div>

          <div className="vivid-container vivid-hero-content">
            <div className="vivid-eyebrow">
              Prismatic Light Through Obsidian · Autonomous Finance
            </div>

            {/* Sculptural Display Stack (Neue Montreal weight 400 at 105px-136px) */}
            <h1 className="vivid-hero-display">
              Autonomous Intelligence.
              <br />
              Clear as Refracted Light.
            </h1>

            <p className="vivid-hero-subtitle">
              Every bank transaction resolved deterministically. Zero spreadsheet friction, zero telemetry monetization, and pure cryptographic tenant isolation.
            </p>

            <div className="vivid-hero-actions">
              <button
                type="button"
                className="vivid-btn-hero-primary"
                onClick={onGetStarted}
                data-cursor="START"
              >
                <span>Initialize Vault</span>
                <ArrowRight size={15} />
              </button>
              <a
                href="#ingestion"
                className="vivid-link-hero-secondary"
                data-cursor="SCROLL"
              >
                Explore Architecture
              </a>
            </div>
          </div>
        </section>

        <hr className="vivid-divider" />

        {/* ==================== FLUID STORYTELLING: SECTION 01 INGESTION ==================== */}
        <section id="ingestion" className="vivid-narrative-section">
          <div className="vivid-container">
            <div className="vivid-narrative-header">
              <div className="vivid-section-tag">Phase 01 / Deterministic Ingestion</div>
              <h2 className="vivid-section-title">
                Cryptographic resolution for messy bank feeds.
              </h2>
              <p className="vivid-section-desc">
                Transform unreadable banking transaction strings into mathematically verified records with zero manual categorization.
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="vivid-refractor-nav">
              <button
                type="button"
                className={`vivid-refractor-tab ${activeSample === "coffee" ? "active" : ""}`}
                onClick={() => setActiveSample("coffee")}
              >
                01 / Coffee Merchant
              </button>
              <button
                type="button"
                className={`vivid-refractor-tab ${activeSample === "airline" ? "active" : ""}`}
                onClick={() => setActiveSample("airline")}
              >
                02 / Flight Carrier
              </button>
              <button
                type="button"
                className={`vivid-refractor-tab ${activeSample === "software" ? "active" : ""}`}
                onClick={() => setActiveSample("software")}
              >
                03 / SaaS Subscription
              </button>
            </div>

            {/* Pure Typographic Split Comparison (Zero Clunky Boxes) */}
            <div className="vivid-refractor-split">
              {/* Left Column: Raw Ingestion Input */}
              <div className="vivid-refractor-col">
                <div className="vivid-col-header">
                  <span>Cryptic Bank Export String</span>
                  <span className="vivid-col-status">Unverified Raw</span>
                </div>
                <div className="vivid-raw-string">
                  {currentSample.raw}
                </div>
                <div className="vivid-hash-meta">
                  Payload Digest: <code>{currentSample.hash}</code>
                </div>
              </div>

              {/* Right Column: Clean Resolved Entity */}
              <div className="vivid-refractor-col">
                <div className="vivid-col-header">
                  <span>Deterministic Ledger Resolution</span>
                  <span className="vivid-col-status resolved">
                    {currentSample.confidence}
                  </span>
                </div>
                <div className="vivid-clean-entity">
                  <div className="vivid-clean-amount">
                    {currentSample.amount}
                  </div>
                  <h3 className="vivid-clean-name">
                    {currentSample.cleanMerchant}
                  </h3>
                  <div className="vivid-clean-meta-row">
                    <span>{currentSample.category}</span>
                    <span className="vivid-meta-bullet">/</span>
                    <span>{currentSample.account}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="vivid-divider" />

        {/* ==================== FLUID STORYTELLING: SECTION 02 NATURAL SQL ==================== */}
        <section id="intelligence" className="vivid-narrative-section">
          <div className="vivid-container">
            <div className="vivid-narrative-header">
              <div className="vivid-section-tag">Phase 02 / Deterministic Intelligence</div>
              <h2 className="vivid-section-title">
                Ask in conversational English. Solved in pure mathematics.
              </h2>
              <p className="vivid-section-desc">
                No LLM hallucinations on your finances. Plain queries compile directly to deterministic SQL executing inside your isolated vault.
              </p>
            </div>

            <div className="vivid-query-strip">
              <div className="vivid-query-list">
                {QUERIES.map((item, idx) => (
                  <div
                    key={idx}
                    className={`vivid-query-item ${activeQuery === idx ? "active" : ""}`}
                    onClick={() => setActiveQuery(idx)}
                    data-cursor="INSPECT"
                  >
                    <div className="vivid-query-num">0{idx + 1}</div>
                    <div className="vivid-query-question">
                      "{item.q}"
                    </div>
                    <div className="vivid-query-sql-box">
                      <code className="vivid-sql-code">{item.sql}</code>
                      <div className="vivid-sql-result">
                        ↳ {item.summary} · {item.confidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="vivid-divider" />

        {/* ==================== FLUID STORYTELLING: SECTION 03 ENCLAVE SPECS ==================== */}
        <section id="enclave" className="vivid-narrative-section">
          <div className="vivid-container">
            <div className="vivid-narrative-header">
              <div className="vivid-section-tag">Phase 03 / Sovereign Architecture</div>
              <h2 className="vivid-section-title">
                Bank-grade controls. Zero telemetry monetization.
              </h2>
              <p className="vivid-section-desc">
                Engineered for those who refuse ad trackers, data brokerage, and opaque cloud telemetry.
              </p>
            </div>

            <div className="vivid-specs-grid">
              <div className="vivid-spec-block">
                <div className="vivid-spec-num">SPEC // 01</div>
                <h3 className="vivid-spec-title">Cryptographic Isolation</h3>
                <p className="vivid-spec-text">
                  Each user account is provisioned inside an isolated cryptographic partition. Your statements are encrypted at rest with keys derived exclusively from your credentials.
                </p>
                <div className="vivid-spec-tags">
                  <span className="vivid-spec-tag">AES-256 GCM</span>
                  <span className="vivid-spec-tag">Zero Telemetry</span>
                </div>
              </div>

              <div className="vivid-spec-block">
                <div className="vivid-spec-num">SPEC // 02</div>
                <h3 className="vivid-spec-title">Multi-Currency Spot Engine</h3>
                <p className="vivid-spec-text">
                  Ingest international credit cards, multi-currency cash flows, and spot exchange rates. Ledger values reconcile automatically without spreadsheet conversion errors.
                </p>
                <div className="vivid-spec-tags">
                  <span className="vivid-spec-tag">Live Spot FX</span>
                  <span className="vivid-spec-tag">OFX &amp; CSV Ready</span>
                </div>
              </div>

              <div className="vivid-spec-block">
                <div className="vivid-spec-num">SPEC // 03</div>
                <h3 className="vivid-spec-title">Zero Credit Checks or Traps</h3>
                <p className="vivid-spec-text">
                  No predatory cross-selling, no unsolicited credit score triggers, and zero third-party advertising tracking. Your financial habits belong exclusively to you.
                </p>
                <div className="vivid-spec-tags">
                  <span className="vivid-spec-tag">Ad-Free</span>
                  <span className="vivid-spec-tag">Independent</span>
                </div>
              </div>

              <div className="vivid-spec-block">
                <div className="vivid-spec-num">SPEC // 04</div>
                <h3 className="vivid-spec-title">Instant Export &amp; Portability</h3>
                <p className="vivid-spec-text">
                  Never trapped in a walled garden. Export audit-ready CSV, JSON, and PDF ledgers with complete schema integrity at any time with a single command.
                </p>
                <div className="vivid-spec-tags">
                  <span className="vivid-spec-tag">Open Data</span>
                  <span className="vivid-spec-tag">Audit-Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CLOSING EDITORIAL STATEMENT ==================== */}
        <section className="vivid-closing-section">
          <div className="vivid-container">
            <div className="vivid-eyebrow">The Sovereign Ledger</div>
            <h2 className="vivid-closing-display">
              Clarity over chaos.
              <br />
              Precision over guesswork.
            </h2>
            <p className="vivid-closing-sub">
              Access the autonomous finance workspace designed for complete mathematical sovereignty.
            </p>
            <button
              type="button"
              className="vivid-btn-hero-primary"
              onClick={onGetStarted}
              data-cursor="START"
            >
              <span>Initialize Workspace</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </section>
      </main>

      {/* ==================== MINIMAL EDITORIAL FOOTER ==================== */}
      <footer className="vivid-footer">
        <div className="vivid-container vivid-footer-inner">
          <div className="vivid-footer-col-left">
            <div className="vivid-footer-brand">FinSight</div>
            <div className="vivid-footer-meta">
              Vivid+Co Architecture · {currentTime ? `Verified System Time: ${currentTime}` : "Deterministic Active"}
            </div>
          </div>

          <div className="vivid-footer-col-right">
            <a href="#ingestion" className="vivid-footer-link">Ingestion</a>
            <a href="#intelligence" className="vivid-footer-link">SQL Engine</a>
            <a href="#enclave" className="vivid-footer-link">Enclave</a>
            <button type="button" onClick={onSignIn} className="vivid-ghost-nav-link">
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

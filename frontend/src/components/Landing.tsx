import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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

  // Advanced Framer Motion Scroll Progress & 3D Spatial Transforms
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Hero 3D Spatial recession on scroll
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 0.9]);
  const heroRotateX = useTransform(smoothProgress, [0, 1], [0, 14]);
  const heroTranslateY = useTransform(smoothProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.85, 1], [1, 0.95, 0.6]);

  // Overall page scroll progress
  const { scrollYProgress: pageScroll } = useScroll();
  const scaleX = useSpring(pageScroll, { stiffness: 100, damping: 30 });

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
      {/* Paper Grain Noise Texture */}
      <div className="pt-noise" />

      {/* Advanced Minimal Scroll Progress Bar */}
      <motion.div
        className="pt-scroll-progress-bar"
        style={{ scaleX }}
      />

      {/* ==================== FLOATING PILL NAV ==================== */}
      <div className="pt-nav-wrapper">
        <header className="pt-nav-bar">
          <div className="pt-nav-left">
            <a href="#" className="pt-logo">
              <span>FinSight</span>
              <span className="pt-logo-dot" />
            </a>

            <nav className="pt-nav-links" aria-label="Main Navigation">
              <a href="#how-it-works" className="pt-nav-pill-btn">
                <span className="ico-box">💳</span>
                <span>Statements</span>
              </a>
              <a href="#ask-ai" className="pt-nav-pill-btn">
                <span className="ico-box">✨</span>
                <span>Ask AI</span>
              </a>
              <a href="#cards" className="pt-nav-pill-btn">
                <span className="ico-box">📈</span>
                <span>Features</span>
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

            <button type="button" className="pt-btn-cta" onClick={onGetStarted}>
              <span>Get Started</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </header>
      </div>

      <div className="pt-container">
        {/* ==================== HERO SECTION WITH 3D SPATIAL SCROLL ==================== */}
        <main>
          <section ref={heroRef} className="pt-hero">
            <div className="pt-hero-headline-wrap">
              <div className="pt-hero-tag">
                <span>Personal Finance AI Tracker</span>
              </div>

              <h1 className="pt-hero-title">
                Your money,<br />
                <span className="highlight-yellow">understood.</span>
              </h1>

              <p className="pt-hero-subtitle">
                Drop your bank statements. FinSight turns messy transactions into crystal clear insights with zero spreadsheet headaches.
              </p>

              <div className="pt-hero-actions">
                <button
                  type="button"
                  className="pt-btn-hero-main"
                  onClick={onGetStarted}
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={15} />
                </button>
                <a href="#how-it-works" className="pt-btn-hero-secondary">
                  <span>See How It Works</span>
                </a>
              </div>
            </div>

            {/* Advanced 3D Spatial Scroll Card (Tilts and scales backward in 3D as you scroll) */}
            <motion.div
              id="how-it-works"
              className="pt-transformer-card-perspective-wrapper"
              style={{
                scale: heroScale,
                rotateX: heroRotateX,
                y: heroTranslateY,
                opacity: heroOpacity,
                transformPerspective: 1200,
              }}
            >
              <div className="pt-transformer-card">
                <div className="transformer-header">
                  <span className="transformer-label">Interactive Statement Transformer</span>
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
                  {/* Raw Bank Text */}
                  <div className="raw-statement-box">
                    <div className="raw-header">Messy Bank Export</div>
                    <div className="raw-text">{currentSample.raw}</div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className="transformer-arrow">→</div>

                  {/* Cleaned FinSight Card */}
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
                      {currentSample.account} · {currentSample.confidence}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ==================== STICKY STACKING CARDS WITH PARALLAX TILT ==================== */}
          <section id="cards" className="pt-stack-section">
            <div className="pt-stack-intro">
              <div className="stack-eyebrow">Everything In One Place</div>
              <h2 className="stack-title">How FinSight organizes your life.</h2>
            </div>

            <div className="pt-cards-stack-container">
              {/* Card 01: Yellow (with -1.5deg natural card stack tilt) */}
              <motion.div
                className="pt-sticky-card card-yellow"
                style={{ rotate: -1.5 }}
                whileHover={{ scale: 1.01, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  <div className="card-num">01 / Ingestion</div>
                  <h3 className="card-heading">Drop Any Bank CSV</h3>
                  <p className="card-desc">
                    Chase, Amex, Apple Card, or local credit unions. Drop any statement format — FinSight automatically deduplicates and normalizes every row in seconds.
                  </p>
                </div>
                <div className="card-visual-slot">
                  <div className="visual-chip-row">
                    <span className="mini-badge">
                      <UploadCloud size={13} />
                      <span>CSV / PDF / QFX</span>
                    </span>
                    <span className="mini-badge">
                      <Check size={13} />
                      <span>Zero Duplicates</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--pt-ink)", fontWeight: 600 }}>
                    Instant Statement Reconciliation
                  </div>
                  <div style={{ fontSize: 12, color: "var(--pt-ink-subtle)", marginTop: 4 }}>
                    Automated SHA-256 fingerprinting ensures duplicate charges are discarded in zero runtime cycles.
                  </div>
                </div>
              </motion.div>

              {/* Card 02: Purple (with +1.2deg natural card stack tilt) */}
              <motion.div
                id="ask-ai"
                className="pt-sticky-card card-purple"
                style={{ rotate: 1.2 }}
                whileHover={{ scale: 1.01, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  <div className="card-num">02 / AI Intelligence</div>
                  <h3 className="card-heading">Ask in Plain English</h3>
                  <p className="card-desc">
                    No formulas, no pivot tables. Ask natural questions like <em>"How much did I spend on dining out last month?"</em> and get clear, verified answers backed by math.
                  </p>
                </div>
                <div className="card-visual-slot">
                  <div className="visual-mock-query">
                    💬 "What were my top 3 expenses in February?"
                  </div>
                  <div className="visual-mock-answer">
                    1. Rent & Housing ($2,400)<br />
                    2. Flight to Austin ($382)<br />
                    3. Whole Foods Groceries ($184)
                  </div>
                </div>
              </motion.div>

              {/* Card 03: Coral (with -0.8deg natural card stack tilt) */}
              <motion.div
                className="pt-sticky-card card-coral"
                style={{ rotate: -0.8 }}
                whileHover={{ scale: 1.01, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  <div className="card-num">03 / Wealth Protection</div>
                  <h3 className="card-heading">Catch Recurring Leaks</h3>
                  <p className="card-desc">
                    Automatically spots forgotten $14.99 SaaS trials, duplicate streaming charges, and price creep before they quietly drain your savings.
                  </p>
                </div>
                <div className="card-visual-slot">
                  <div className="visual-chip-row">
                    <span className="mini-badge" style={{ background: "#FEE2E2", color: "#991B1B" }}>
                      ⚠️ Price Increase
                    </span>
                    <span className="mini-badge">Streaming +$3/mo</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--pt-ink)", fontWeight: 600 }}>
                    Monthly Waste Eliminator
                  </div>
                  <div style={{ fontSize: 12, color: "var(--pt-ink-subtle)", marginTop: 4 }}>
                    Identified $64/month in unused subscriptions ready for cancellation.
                  </div>
                </div>
              </motion.div>

              {/* Card 04: Dark (with 0deg anchor card stack tilt) */}
              <motion.div
                className="pt-sticky-card card-dark"
                style={{ rotate: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  <div className="card-num">04 / Privacy & Security</div>
                  <h3 className="card-heading" style={{ color: "#FFFFFF" }}>100% Private Enclave</h3>
                  <p className="card-desc">
                    Your financial data belongs exclusively to you. No tracking, no selling your bank data to credit card brokers, zero third-party ads.
                  </p>
                </div>
                <div className="card-visual-slot">
                  <div className="visual-chip-row">
                    <span className="mini-badge">
                      <ShieldCheck size={13} color="#22C55E" />
                      <span>AES-256 Encryption</span>
                    </span>
                    <span className="mini-badge">
                      <CheckCircle2 size={13} color="#22C55E" />
                      <span>Tenant Isolated</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#FFFFFF", fontWeight: 600 }}>
                    Deterministic SQL Security
                  </div>
                  <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 4 }}>
                    Strict SELECT-only execution guardrails scoped to your personal user account.
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ==================== BOTTOM CTA ==================== */}
          <section className="pt-cta-section">
            <div className="pt-cta-box">
              <h2 className="pt-cta-title">Ready to see your money clearly?</h2>
              <p className="pt-cta-sub">
                Join users who took control of their spending with FinSight. No credit card required to get started.
              </p>
              <button
                type="button"
                className="pt-btn-hero-main"
                onClick={onGetStarted}
              >
                <span>Get Started Free</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </main>

        {/* ==================== FOOTER ==================== */}
        <footer className="pt-footer">
          <div>FinSight · Personal Finance AI Tracker</div>
          <div>{currentTime ? `Local Time: ${currentTime}` : "Live Sync"} · Private & Deterministic</div>
        </footer>
      </div>
    </div>
  );
}

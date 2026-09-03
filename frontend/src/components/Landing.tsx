import { useEffect } from "react";
import { ArrowUpRight, CheckCircle2, MessageSquare, Search, Sparkles, UploadCloud } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./landing/landing.css";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
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

  return (
    <div className="minimal-landing">
      <div className="minimal-bg-glow" />

      <div className="minimal-container">
        {/* Navigation */}
        <header className="minimal-header">
          <a href="#" className="minimal-brand">
            <span>FinSight</span>
            <span className="minimal-brand-badge">AI</span>
          </a>

          <div className="minimal-header-actions">
            <button type="button" className="btn-ghost" onClick={onSignIn}>
              Sign In
            </button>
            <button type="button" className="btn-solid" onClick={onGetStarted}>
              <span>Get Started</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </header>

        {/* Hero */}
        <main>
          <section className="minimal-hero">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              <span>Personal Finance AI Tracker</span>
            </div>

            <h1 className="hero-title">
              See your money clearly.
            </h1>

            <p className="hero-subtitle">
              Drop your bank statements. FinSight automatically categorizes your spending and lets you query your finances in plain English.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn-primary-large" onClick={onGetStarted}>
                <span>Get Started Free</span>
                <ArrowUpRight size={15} />
              </button>
              <a href="#features" className="btn-secondary-large">
                <span>How It Works</span>
              </a>
            </div>

            {/* Interactive Live App Preview Window (Real Personal Finance Niche) */}
            <div className="hero-app-window">
              <div className="window-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="window-search-pill">
                  <Search size={12} />
                  <span>Ask FinSight anything about your spending...</span>
                </div>
                <div style={{ width: 40 }} />
              </div>

              <div className="window-content">
                {/* Left: Real Personal Finance Snapshot */}
                <div>
                  <div className="window-metrics-row">
                    <div className="mini-stat-card">
                      <span className="stat-label">Total Net Balance</span>
                      <div className="stat-val">$148,250.00</div>
                      <div className="stat-sub">+3.2% this month</div>
                    </div>
                    <div className="mini-stat-card">
                      <span className="stat-label">Monthly Spending</span>
                      <div className="stat-val">$3,842.10</div>
                      <div className="stat-sub" style={{ color: "var(--text-secondary)" }}>Within target budget</div>
                    </div>
                  </div>

                  <div className="mini-list-title">Recent Activity</div>
                  <div className="mini-tx-item">
                    <div>
                      <span className="mini-tx-merchant">Trader Joe's</span>
                      <span className="mini-tx-cat">Groceries</span>
                    </div>
                    <span className="mini-tx-amount">-$74.20</span>
                  </div>
                  <div className="mini-tx-item">
                    <div>
                      <span className="mini-tx-merchant">Delta Air Lines</span>
                      <span className="mini-tx-cat">Travel</span>
                    </div>
                    <span className="mini-tx-amount">-$380.00</span>
                  </div>
                  <div className="mini-tx-item">
                    <div>
                      <span className="mini-tx-merchant">Blue Bottle Coffee</span>
                      <span className="mini-tx-cat">Dining</span>
                    </div>
                    <span className="mini-tx-amount">-$6.50</span>
                  </div>
                  <div className="mini-tx-item">
                    <div>
                      <span className="mini-tx-merchant">Payroll Deposit</span>
                      <span className="mini-tx-cat" style={{ color: "#22c55e" }}>Income</span>
                    </div>
                    <span className="mini-tx-amount" style={{ color: "#22c55e" }}>+$4,850.00</span>
                  </div>
                </div>

                {/* Right: AI Natural Language Query Card */}
                <div className="window-ai-panel">
                  <div>
                    <div className="ai-query-input-box">
                      <MessageSquare size={14} color="#3b82f6" />
                      <span className="ai-query-text">"How much did I spend on dining out last month?"</span>
                    </div>

                    <div className="ai-answer-card">
                      <p>
                        You spent <strong>$542.80</strong> across 11 dining transactions in February. That is <strong>12% lower</strong> than January.
                      </p>
                    </div>
                  </div>

                  <div className="ai-meta-tag">
                    <Sparkles size={12} color="#3b82f6" />
                    <span>Instant AI response backed by verified SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 Clear, Minimal Feature Cards */}
          <section id="features" className="minimal-features-section">
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything you need to stay on top of your finances.</h2>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-box">
                  <UploadCloud size={20} />
                </div>
                <h3>Drop Any Bank CSV</h3>
                <p>
                  Export statements from Chase, Amex, Apple Card, or your local bank. FinSight automatically cleans the data and skips duplicate rows.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <MessageSquare size={20} />
                </div>
                <h3>Ask Questions in English</h3>
                <p>
                  Skip complicated spreadsheets. Ask natural questions like <em>"What were my biggest expenses last week?"</em> and get answers immediately.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box">
                  <CheckCircle2 size={20} />
                </div>
                <h3>Smart Auto-Categorization</h3>
                <p>
                  Our hybrid classification engine maps messy bank codes like <code>SQ *COFFEE ROASTERS</code> to clean, recognizable categories with 99.8% accuracy.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Minimal Footer */}
        <footer className="minimal-footer">
          <div>FinSight · Personal Finance AI Tracker</div>
          <div>Private, deterministic, and built for simplicity.</div>
        </footer>
      </div>
    </div>
  );
}

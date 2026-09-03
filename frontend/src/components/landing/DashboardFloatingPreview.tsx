import { useState } from "react";
import { IconCoins, IconSpark, IconWallet } from "../../icons";

export function DashboardFloatingPreview() {
  const [activeTab, setActiveTab] = useState<"card" | "preview">("preview");

  return (
    <div className="hero-interactive-suite" data-cursor="INTERACT">
      {/* Switcher Tab */}
      <div className="suite-tab-row">
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          <IconCoins size={13} />
          <span>Live Enclave Preview</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "card" ? "active" : ""}`}
          onClick={() => setActiveTab("card")}
        >
          <IconWallet size={13} />
          <span>Black Platinum Hardware</span>
        </button>
      </div>

      {/* Viewport */}
      {activeTab === "preview" ? (
        <div className="suite-display-viewport floating-picture-anim">
          <div className="preview-editorial-board">
            {/* Top Bar */}
            <div className="p-editorial-top">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="p-dot" />
                <span className="p-badge-text">FINSIGHT ENCLAVE // LIVE</span>
              </div>
              <span className="p-cur-text">PRIMARY LEDGER · USD</span>
            </div>

            {/* Metric Row */}
            <div className="p-editorial-kpis">
              <div className="p-kpi-item">
                <span className="p-kpi-label">NET BALANCE</span>
                <span className="p-kpi-val">$148,250.00</span>
                <span className="p-kpi-trend good">+12.4% vs last cycle</span>
              </div>
              <div className="p-kpi-item">
                <span className="p-kpi-label">MONTHLY SPEND</span>
                <span className="p-kpi-val">$8,420.35</span>
                <span className="p-kpi-trend">Consistent pacing</span>
              </div>
              <div className="p-kpi-item">
                <span className="p-kpi-label">NET CASH FLOW</span>
                <span className="p-kpi-val good">+$14,200.00</span>
                <span className="p-kpi-trend good">Surplus reinvestable</span>
              </div>
            </div>

            {/* Middle: Sparkline & Category Donut Miniature */}
            <div className="p-editorial-grid">
              <div className="p-grid-box">
                <div className="p-box-header">
                  <span>CASH VELOCITY (30-DAY)</span>
                  <span style={{ color: "var(--gold)" }}>RECHARTS AST</span>
                </div>
                <svg className="p-sparkline-svg" viewBox="0 0 300 70">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A46D" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#C5A46D" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,55 Q 50,20 100,38 T 200,18 T 300,30 L 300,70 L 0,70 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M 0,55 Q 50,20 100,38 T 200,18 T 300,30"
                    fill="none"
                    stroke="#C5A46D"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              <div className="p-grid-box">
                <div className="p-box-header">
                  <span>CATEGORY ALLOCATION</span>
                  <span>5 TIERS</span>
                </div>
                <div className="p-cat-list">
                  <div className="p-cat-row">
                    <span>Executive Travel</span>
                    <strong style={{ color: "#F6F3EC" }}>42%</strong>
                  </div>
                  <div className="p-cat-row">
                    <span>Cloud &amp; Infrastructure</span>
                    <strong style={{ color: "#C5A46D" }}>28%</strong>
                  </div>
                  <div className="p-cat-row">
                    <span>Corporate Dining</span>
                    <strong style={{ color: "#E9E4D9" }}>18%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight Bar */}
            <div className="p-editorial-ai">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <IconSpark size={14} />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
                  FINSIGHT AI SYNTHESIS
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#E9E4D9", lineHeight: 1.5 }}>
                &ldquo;Dining spend is 18% higher than last month across 4 transactions. Automated tax deduction tags applied.&rdquo;
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="suite-display-viewport floating-picture-anim">
          <img
            src="/images/card-titanium.jpg"
            alt="FinSight Black Platinum Hardware Card"
            className="suite-hero-img"
          />
          <div className="card-floating-badge badge-top-right">
            <span className="pulse-ping" />
            <span>AES-256 HARDWARE SECURE</span>
          </div>
          <div className="suite-caption-strip">
            <div>
              <span className="strip-label">PHYSICAL LEDGER</span>
              <span className="strip-title">FinSight Black Platinum</span>
            </div>
            <span className="strip-action">Titanium 2026 Edition</span>
          </div>
        </div>
      )}
    </div>
  );
}

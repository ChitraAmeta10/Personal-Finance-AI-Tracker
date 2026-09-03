import { useState, useRef } from "react";
import { IconCoins, IconSpark, IconWallet } from "../../icons";

export function DashboardFloatingPreview() {
  const [activeTab, setActiveTab] = useState<"card" | "tablet" | "ledger">("card");
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.5,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="hero-interactive-suite" data-cursor="3D TILT">
      {/* 3D Mode Selector Pills */}
      <div className="suite-tab-row">
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "card" ? "active" : ""}`}
          onClick={() => setActiveTab("card")}
        >
          <IconWallet size={13} />
          <span>Quantum Titanium Card</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "tablet" ? "active" : ""}`}
          onClick={() => setActiveTab("tablet")}
        >
          <IconSpark size={13} />
          <span>Neural Analytics Matrix</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "ledger" ? "active" : ""}`}
          onClick={() => setActiveTab("ledger")}
        >
          <IconCoins size={13} />
          <span>Live App Enclave</span>
        </button>
      </div>

      {/* 3D Tilt Viewport */}
      <div
        ref={cardRef}
        className="suite-display-viewport"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Dynamic Holographic Specular Sheen */}
        <div
          className="suite-glare-sheen"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(0, 242, 254, 0.45) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 65%)`,
            opacity: glare.opacity,
            transition: "opacity 0.25s ease",
          }}
        />

        {activeTab === "card" && (
          <div className="suite-card-inner">
            <img
              src="/images/hologram-card.jpg"
              alt="FinSight Quantum Titanium Card"
              className="suite-hero-img"
            />
            <div className="card-floating-badge badge-top-right">
              <span className="pulse-ping" />
              <span>QUANTUM SECURE // AES-256</span>
            </div>
            <div className="card-floating-badge badge-bottom-left">
              <span style={{ color: "var(--fin-cyan)", fontWeight: 700 }}>$148,250.00</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>LIQUID RESERVE</span>
            </div>
            <div className="suite-caption-strip">
              <div>
                <span className="strip-label">PHYSICAL ASSET ARCHITECTURE</span>
                <span className="strip-title">FinSight Black Platinum Hardware</span>
              </div>
              <span className="strip-action">Titanium · Laser Etched</span>
            </div>
          </div>
        )}

        {activeTab === "tablet" && (
          <div className="suite-card-inner">
            <img
              src="/images/hologram-tablet.jpg"
              alt="FinSight Neural Analytics Matrix"
              className="suite-hero-img"
            />
            <div className="card-floating-badge badge-top-right">
              <span className="pulse-ping" style={{ background: "var(--fin-violet)" }} />
              <span>SPEND VELOCITY // RECHARTS 2.15</span>
            </div>
            <div className="suite-caption-strip">
              <div>
                <span className="strip-label">QUANTITATIVE TELEMETRY</span>
                <span className="strip-title">Real-Time Neural Cashflow Curve</span>
              </div>
              <span className="strip-action">&lt; 0.8ms AST Latency</span>
            </div>
          </div>
        )}

        {activeTab === "ledger" && (
          <div className="suite-card-inner">
            <img
              src="/images/dashboard-dark.png"
              alt="FinSight Live App Enclave"
              className="suite-hero-img"
            />
            <div className="card-floating-badge badge-top-right">
              <span className="pulse-ping" />
              <span>POSTGRESQL 16 // LIVE ENCLAVE</span>
            </div>
            <div className="suite-caption-strip">
              <div>
                <span className="strip-label">PRODUCTION INTERFACE</span>
                <span className="strip-title">Verified Multi-Tenant Dark Ledger</span>
              </div>
              <span className="strip-action">100% Idempotent</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

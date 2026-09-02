import { useState, useRef, type MouseEvent } from "react";
import { Sparkles, Shield, Cpu, ArrowUpRight } from "lucide-react";

export function InteractiveHeroVisual() {
  const [activeTab, setActiveTab] = useState<"card" | "matrix">("card");
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div className="hero-interactive-suite">
      {/* Tab Switcher Pills */}
      <div className="suite-tab-row">
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "card" ? "active" : ""}`}
          onClick={() => setActiveTab("card")}
          data-cursor="TITANIUM"
        >
          <Sparkles size={13} />
          <span>FinSight Black Platinum</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "matrix" ? "active" : ""}`}
          onClick={() => setActiveTab("matrix")}
          data-cursor="TELEMETRY"
        >
          <Cpu size={13} />
          <span>Neural Analytics Matrix</span>
        </button>
      </div>

      {/* 3D Perspective Visual Display */}
      <div
        ref={cardRef}
        className="suite-display-viewport"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: transformStyle,
          transition: transformStyle ? "transform 0.08s ease-out" : "transform 0.5s ease",
        }}
        data-cursor="INTERACT"
      >
        {/* Dynamic Holographic Specular Glare */}
        <div
          className="suite-glare-sheen"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.22), transparent 60%)`,
          }}
        />

        {activeTab === "card" ? (
          <div className="suite-card-inner moving-picture-layer">
            <img
              src="/images/card-titanium.jpg"
              alt="FinSight Black Platinum Card"
              className="suite-hero-img floating-picture-anim"
            />
            {/* Live Telemetry Floating Overlays */}
            <div className="card-floating-badge badge-top-right">
              <span className="pulse-ping" />
              <span>AI ENCLAVE // ACTIVE</span>
            </div>
            <div className="card-floating-badge badge-bottom-left">
              <Shield size={12} color="#cca77c" />
              <span>$4,820.00 RECOVERED YIELD</span>
            </div>
          </div>
        ) : (
          <div className="suite-card-inner moving-picture-layer">
            <img
              src="/images/dashboard-matrix.jpg"
              alt="FinSight Real-Time Analytics Matrix"
              className="suite-hero-img floating-picture-anim"
            />
            <div className="card-floating-badge badge-top-right">
              <span className="pulse-ping" />
              <span>LIVE TELEMETRY // 0.8MS</span>
            </div>
            <div className="card-floating-badge badge-bottom-left">
              <span>99.8% CLAUDE 3.5 PRECISION</span>
            </div>
          </div>
        )}

        {/* Caption Bar */}
        <div className="suite-caption-strip">
          <div className="strip-left">
            <span className="strip-label">[ SYSTEM HARDWARE // 01 ]</span>
            <span className="strip-title">
              {activeTab === "card"
                ? "Black Obsidian Titanium Smart Ledger"
                : "Real-time Autonomous Analytics Matrix"}
            </span>
          </div>
          <div className="strip-right">
            <span className="strip-action">
              <span>DRAG TO TILT 3D</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

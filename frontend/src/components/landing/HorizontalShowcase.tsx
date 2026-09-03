import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Terminal } from "lucide-react";

interface SlideData {
  id: string;
  category: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  image: string;
  icon: JSX.Element;
}

const SLIDES: SlideData[] = [
  {
    id: "quantum-card",
    category: "PHYSICAL ASSET ARCHITECTURE",
    title: "Quantum Titanium Hardware Monolith",
    description:
      "Engineered from aerospace-grade black titanium with embedded cryptographic secure element. Zero plain-text key storage, biometric authorization, and real-time offline ledger balance attestation.",
    metric: "AES-256",
    metricLabel: "Hardware Security Module (HSM)",
    tags: ["Laser Etched", "Tamper Resistant", "Zero-Knowledge"],
    image: "/images/hologram-card.jpg",
    icon: <ShieldCheck size={18} />,
  },
  {
    id: "neural-analytics",
    category: "QUANTITATIVE TELEMETRY",
    title: "Neural Analytics Matrix & Spend Velocity",
    description:
      "Real-time liquidity curves, automated recurring leak discovery, and predictive wealth compounding simulations computed through Recharts 2.15 data visualization engines.",
    metric: "< 0.8ms",
    metricLabel: "AST Parser Execution Latency",
    tags: ["Recharts 2.15", "Colorblind-Safe", "Predictive Yield"],
    image: "/images/hologram-tablet.jpg",
    icon: <Sparkles size={18} />,
  },
  {
    id: "text-to-sql",
    category: "NATURAL LANGUAGE ENGINE",
    title: "Zero-Injection SQL Synthesis Engine",
    description:
      "Transform freeform questions into verified read-only SQL queries via Claude 3.5 Sonnet. Every AST is validated, read-only restricted, and mathematically scoped to your encrypted tenant partition.",
    metric: "100%",
    metricLabel: "SELECT-Only Guardrail Enforcement",
    tags: ["AST Parser", "Zero Prompt-Injection", "Claude 3.5"],
    image: "/images/ask-ai.png",
    icon: <Terminal size={18} />,
  },
  {
    id: "ingestion-core",
    category: "DETERMINISTIC PIPELINE",
    title: "Format-Agnostic Statement Ingestion",
    description:
      "Streamlines messy bank exports from Chase, Amex, SVB, and Revolut. Automated SHA-256 idempotency hashing ensures duplicate charges are discarded in zero runtime cycles.",
    metric: "74 Tests",
    metricLabel: "Automated Unit & Ingestion Tests Passing",
    tags: ["100% Idempotent", "PostgreSQL 16", "Zero Hallucination"],
    image: "/images/dashboard-dark.png",
    icon: <CheckCircle2 size={18} />,
  },
];

export function HorizontalShowcase() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const current = SLIDES[currentIdx];

  return (
    <div className="horizontal-showcase-wrapper" data-cursor="SLIDE">
      {/* Top Controller Bar */}
      <div className="showcase-nav-bar">
        <div className="showcase-index-indicator">
          <span className="current-num">0{currentIdx + 1}</span>
          <span className="total-num">/ 0{SLIDES.length}</span>
          <span className="slide-category">{current.category}</span>
        </div>

        <div className="showcase-controls">
          <div className="slide-pills-row">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`slide-pill ${idx === currentIdx ? "active" : ""}`}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="control-arrow-btn"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="control-arrow-btn"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide Body */}
      <div className="feature-slide-card">
        {/* Left Information Pane */}
        <div className="slide-text-pane">
          <div className="slide-eyebrow">
            {current.icon}
            <span>{current.category}</span>
          </div>

          <h3 className="slide-heading">{current.title}</h3>
          <p className="slide-description">{current.description}</p>

          <div className="slide-metric-highlight">
            <div className="metric-figure">{current.metric}</div>
            <div className="metric-caption">{current.metricLabel}</div>
          </div>

          <div className="slide-tags-row">
            {current.tags.map((tag) => (
              <span key={tag} className="slide-tag">
                <ArrowUpRight size={12} />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Media Pane with Glowing Neon Border */}
        <div className="slide-media-pane">
          <img
            src={current.image}
            alt={current.title}
            className="slide-image-element"
          />
          <div className="media-corner-tag">
            <Sparkles size={12} />
            <span>FINSIGHT TELEMETRY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

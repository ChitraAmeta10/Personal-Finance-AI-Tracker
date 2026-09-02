import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

interface FeatureSlide {
  id: string;
  num: string;
  title: string;
  category: string;
  desc: string;
  metric: string;
  metricLabel: string;
  image: string;
  tags: string[];
}

const SLIDES: FeatureSlide[] = [
  {
    id: "hybrid",
    num: "01",
    category: "HYBRID CLASSIFIER",
    title: "Dual-Engine Deterministic & LLM Pipeline",
    desc: "Unambiguous merchants are processed in 0.01ms via regex keyword rules at zero API cost; only ambiguous strings route to Claude 3.5 in batched embeddings.",
    metric: "99.8%",
    metricLabel: "Categorization Accuracy",
    image: "/images/dashboard-dark.png",
    tags: ["RULES FIRST", "CLAUDE 3.5", "BATCHED EMBEDDINGS"],
  },
  {
    id: "sql",
    num: "02",
    category: "NATURAL LANGUAGE AST",
    title: "Verifiable Text-to-SQL Architecture",
    desc: "Inquire about spending in everyday conversational English. Queries are parsed through sqlglot AST validators, rejected if mutating, and strictly bound to your tenant.",
    metric: "< 14ms",
    metricLabel: "Average Query Latency",
    image: "/images/ask-ai.png",
    tags: ["SELECT ONLY", "PARAMETERIZED", "FULL AUDIT TRAIL"],
  },
  {
    id: "analytics",
    num: "03",
    category: "EXECUTIVE TELEMETRY",
    title: "Executive Wealth & Cashflow Velocity",
    desc: "Monitor month-over-month burn rate, discretionary capital, and category distributions on a scientifically validated, colorblind-safe spectrum.",
    metric: "100%",
    metricLabel: "Idempotent Dedup",
    image: "/images/dashboard-matrix.jpg",
    tags: ["RECHARTS", "COLORBLIND SAFE", "POSTGRESQL 16"],
  },
  {
    id: "hardware",
    num: "04",
    category: "SMART LEDGER",
    title: "FinSight Black Platinum Architecture",
    desc: "A seamless bridge between physical transactions and autonomous digital categorization, backed by bank-grade JWT authentication and MongoDB 7 AI telemetry.",
    metric: "74 Tests",
    metricLabel: "Pytest Suites Passing",
    image: "/images/card-titanium.jpg",
    tags: ["TITANIUM FINISH", "AES-256", "MONGODB TELEMETRY"],
  },
];

export function HorizontalShowcase() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const current = SLIDES[currentIndex];

  return (
    <div className="horizontal-showcase-wrapper" data-cursor="EXPLORE">
      {/* Top Header & Navigation Controls */}
      <div className="showcase-nav-bar">
        <div className="showcase-index-indicator">
          <span className="current-num">[ {current.num} ]</span>
          <span className="total-num">/ 04</span>
          <span className="slide-category">{current.category}</span>
        </div>

        <div className="showcase-controls">
          <button
            type="button"
            className="control-arrow-btn"
            onClick={prevSlide}
            aria-label="Previous Slide"
            data-cursor="PREV"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="slide-pills-row">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`slide-pill ${currentIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                data-cursor={slide.num}
              />
            ))}
          </div>
          <button
            type="button"
            className="control-arrow-btn"
            onClick={nextSlide}
            aria-label="Next Slide"
            data-cursor="NEXT"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Feature Slide Card */}
      <div className="feature-slide-card">
        {/* Left Content Side */}
        <div className="slide-content-pane">
          <div className="slide-eyebrow">
            <Sparkles size={12} color="#cca77c" />
            <span>ARCHITECTURAL SUBSYSTEM // {current.num}</span>
          </div>

          <h3 className="slide-heading">{current.title}</h3>
          <p className="slide-description">{current.desc}</p>

          <div className="slide-metric-highlight">
            <div className="metric-figure">{current.metric}</div>
            <div className="metric-caption">{current.metricLabel}</div>
          </div>

          <div className="slide-tags-row">
            {current.tags.map((tag, i) => (
              <span key={i} className="slide-tag">
                <CheckCircle2 size={11} color="#cca77c" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Media Frame */}
        <div className="slide-media-pane" data-cursor="VIEW">
          <img
            src={current.image}
            alt={current.title}
            className="slide-image-element"
            loading="lazy"
          />
          <div className="media-corner-tag">
            <span>FIGURE // {current.num}</span>
            <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

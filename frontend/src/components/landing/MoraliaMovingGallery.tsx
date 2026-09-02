import { useState, useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface ShowcaseRow {
  num: string;
  category: string;
  title: string;
  desc: string;
  image: string;
  tags: string[];
}

const ROWS: ShowcaseRow[] = [
  {
    num: "01",
    category: "LEDGER & ANALYTICS",
    title: "Autonomous Cashflow Engine",
    desc: "PostgreSQL 16 & MongoDB 7 polyglot telemetry. Real-time burn velocity and category distribution on a colorblind-safe spectrum.",
    image: "/images/dashboard-dark.png",
    tags: ["RULES FIRST", "DEDUP HASH", "RECHARTS"],
  },
  {
    num: "02",
    category: "NEURAL ENGINE",
    title: "Natural Language Text-to-SQL",
    desc: "Conversational queries validated through sqlglot abstract syntax tree parsers with zero prompt injection.",
    image: "/images/ask-ai.png",
    tags: ["SELECT ONLY", "AUDIT TRAIL", "CLAUDE 3.5"],
  },
  {
    num: "03",
    category: "PHYSICAL ARCHITECTURE",
    title: "FinSight Black Platinum",
    desc: "Matte black obsidian titanium hardware card paired with bank-grade JWT authentication and tenant isolation.",
    image: "/images/card-titanium.jpg",
    tags: ["TITANIUM FINISH", "AES-256", "HARD ISOLATION"],
  },
  {
    num: "04",
    category: "EXECUTIVE SUITE",
    title: "Real-Time Telemetry Matrix",
    desc: "Sub-millisecond spend ingestion, automated SaaS leak detection, and 5-year wealth compounding projections.",
    image: "/images/dashboard-matrix.jpg",
    tags: ["SUB-MS LATENCY", "LEAK DETECTOR", "RECOVERED CAPITAL"],
  },
];

export function MoraliaMovingGallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lerpPos, setLerpPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking relative to container for silky smooth floating image follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  // Silky lerp animation loop for the floating picture
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setLerpPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.1,
        y: prev.y + (mousePos.y - prev.y) * 0.1,
      }));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [mousePos]);

  const activeRow = activeIdx !== null ? ROWS[activeIdx] : ROWS[0];

  return (
    <div
      ref={containerRef}
      className="moralia-interactive-list"
      onMouseMove={handleMouseMove}
      data-cursor="HOVER"
    >
      {/* Floating Moving Picture (The signature Moralia cursor-following photo) */}
      <div
        className={`moralia-floating-picture ${activeIdx !== null ? "visible" : ""}`}
        style={{
          transform: `translate3d(${lerpPos.x - 180}px, ${lerpPos.y - 120}px, 0) rotate(${
            (lerpPos.x - mousePos.x) * -0.06
          }deg)`,
        }}
      >
        <div className="picture-inner-frame">
          <img
            src={activeRow.image}
            alt={activeRow.title}
            className="floating-img-element"
          />
          <div className="floating-img-overlay" />
          <div className="floating-img-tag">
            <span>[ FIG {activeRow.num} ]</span>
            <span>{activeRow.category}</span>
          </div>
        </div>
      </div>

      {/* Rows List */}
      <div className="moralia-rows-wrapper">
        {ROWS.map((row, idx) => {
          const isHovered = activeIdx === idx;
          return (
            <div
              key={row.num}
              className={`moralia-list-row ${isHovered ? "active" : ""}`}
              onMouseEnter={() => setActiveIdx(idx)}
              data-cursor="VIEW"
            >
              <div className="row-num-col">
                <span className="row-bracket">[</span>
                <span className="row-num">{row.num}</span>
                <span className="row-bracket">]</span>
              </div>

              <div className="row-title-col">
                <h3 className="row-title-text">{row.title}</h3>
                <span className="row-category-text">{row.category}</span>
              </div>

              <div className="row-desc-col">
                <p className="row-desc-text">{row.desc}</p>
                <div className="row-tags-strip">
                  {row.tags.map((t, i) => (
                    <span key={i} className="row-tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="row-action-col">
                <span className="row-circle-btn">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

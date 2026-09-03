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
    category: "CORE LEDGER & ANALYTICS",
    title: "Autonomous Cashflow Engine",
    desc: "PostgreSQL 16 & MongoDB 7 polyglot persistence. Real-time spend velocity, category donuts, and month-over-month trends on a colorblind-safe spectrum.",
    image: "/images/dashboard-dark.png",
    tags: ["RULES FIRST", "DEDUP HASH", "RECHARTS"],
  },
  {
    num: "02",
    category: "NEURAL ENGINE",
    title: "Natural Language Text-to-SQL",
    desc: "Ask complex financial questions in plain English. Verified through SQL AST parsers with zero prompt-injection vectors.",
    image: "/images/ask-ai.png",
    tags: ["SELECT ONLY", "AUDIT TRAIL", "CLAUDE 3.5"],
  },
  {
    num: "03",
    category: "PHYSICAL ARCHITECTURE",
    title: "FinSight Black Platinum",
    desc: "Matte black obsidian titanium smart card hardware paired with bank-grade JWT authentication and tenant isolation.",
    image: "/images/card-titanium.jpg",
    tags: ["TITANIUM FINISH", "AES-256", "ENCLAVE"],
  },
  {
    num: "04",
    category: "EXECUTIVE TELEMETRY",
    title: "Real-Time Yield & Leaks",
    desc: "Automated SaaS subscription leak detection, tax-deductible expense sorting, and 5-year wealth compounding projections.",
    image: "/images/dashboard-matrix.jpg",
    tags: ["SUB-MS LATENCY", "LEAK DETECTOR", "COMPOUNDING"],
  },
];

export function MoraliaMovingGallery() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lerpPos, setLerpPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  useEffect(() => {
    let animId: number;
    const loop = () => {
      setLerpPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.08,
        y: prev.y + (mousePos.y - prev.y) * 0.08,
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
      className="rose-interactive-list"
      onMouseMove={handleMouseMove}
      data-cursor="EXPLORE"
    >
      {/* Floating Picture Card Following Cursor (Rose Family Style) */}
      <div
        className={`rose-floating-preview ${activeIdx !== null ? "visible" : ""}`}
        style={{
          transform: `translate3d(${lerpPos.x - 170}px, ${lerpPos.y - 120}px, 0) rotate(${
            (lerpPos.x - mousePos.x) * -0.04
          }deg)`,
        }}
      >
        <div className="preview-media-box">
          <img
            src={activeRow.image}
            alt={activeRow.title}
            className="preview-img"
          />
          <div className="preview-glass-tag">
            <span className="preview-num">{activeRow.num}</span>
            <span className="preview-cat">{activeRow.category}</span>
          </div>
        </div>
      </div>

      {/* Rows List */}
      <div className="rose-rows-container">
        {ROWS.map((row, idx) => {
          const isHovered = activeIdx === idx;
          return (
            <div
              key={row.num}
              className={`rose-row-item ${isHovered ? "active" : ""}`}
              onMouseEnter={() => setActiveIdx(idx)}
              data-cursor="VIEW"
            >
              <div className="rose-row-left">
                <span className="rose-row-num">{row.num}</span>
                <div className="rose-row-titles">
                  <h3 className="rose-row-headline">{row.title}</h3>
                  <span className="rose-row-sub">{row.category}</span>
                </div>
              </div>

              <div className="rose-row-center">
                <p className="rose-row-p">{row.desc}</p>
                <div className="rose-row-tags">
                  {row.tags.map((t, i) => (
                    <span key={i} className="rose-tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rose-row-right">
                <span className="rose-circle-arrow">
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

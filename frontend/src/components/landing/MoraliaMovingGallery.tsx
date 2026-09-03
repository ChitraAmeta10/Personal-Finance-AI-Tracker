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
    category: "PHYSICAL ASSET ENCLAVE",
    title: "Quantum Titanium Hardware",
    desc: "Laser-etched aerospace titanium smart card coupled with tenant-isolated AES-256 enclaves and zero plain-text key exposure.",
    image: "/images/hologram-card.jpg",
    tags: ["TITANIUM FINISH", "AES-256", "ZERO-KNOWLEDGE"],
  },
  {
    num: "02",
    category: "NEURAL ANALYTICS MATRIX",
    title: "Global Spend Velocity Matrix",
    desc: "Sub-millisecond spend velocity curves, recurring leak detectors, and 5-year wealth compounding models visualized in real time.",
    image: "/images/hologram-tablet.jpg",
    tags: ["SUB-MS LATENCY", "RECHARTS 2.15", "COMPOUNDING"],
  },
  {
    num: "03",
    category: "NATURAL LANGUAGE AST",
    title: "Zero-Injection Text-to-SQL",
    desc: "Ask complex questions in conversational English. Verified through SQL AST parsers strictly scoped to your tenant ID.",
    image: "/images/ask-ai.png",
    tags: ["SELECT ONLY", "AUDIT TRAIL", "CLAUDE 3.5"],
  },
  {
    num: "04",
    category: "POLYGLOT PERSISTENCE",
    title: "Autonomous Ingestion Core",
    desc: "Format-agnostic CSV parser with SHA-256 deduplication and hybrid rule-first deterministic classification.",
    image: "/images/dashboard-dark.png",
    tags: ["100% IDEMPOTENT", "POSTGRESQL 16", "74 UNIT TESTS"],
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
      className="rose-interactive-list"
      onMouseMove={handleMouseMove}
      data-cursor="EXPLORE"
    >
      {/* 3D Floating Picture Card Following Cursor with Lerp Physics */}
      <div
        className={`rose-floating-preview ${activeIdx !== null ? "visible" : ""}`}
        style={{
          transform: `translate3d(${lerpPos.x - 190}px, ${lerpPos.y - 130}px, 0) rotate(${
            (lerpPos.x - mousePos.x) * -0.06
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
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

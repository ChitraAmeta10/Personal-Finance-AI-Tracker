import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectShowcaseItem {
  id: string;
  num: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  tags: string[];
}

const ITEMS: ProjectShowcaseItem[] = [
  {
    id: "vault",
    num: "01",
    category: "ARCHITECTURAL VAULT",
    title: "Autonomous Financial Intelligence",
    subtitle: "Real-time AI telemetry, hybrid categorization reasoning, and multi-tenant ledger persistence.",
    image: "/images/hero-vault.jpg",
    tags: ["CLAUDE 3.5", "FASTAPI", "POSTGRES 16", "MONGODB 7"],
  },
  {
    id: "dashboard",
    num: "02",
    category: "TELEMETRY & ANALYTICS",
    title: "Executive Spending Intelligence",
    subtitle: "Month-over-month burn rate, ranked merchant exposure, and category distribution on a colorblind-safe palette.",
    image: "/images/dashboard-dark.png",
    tags: ["COLORBLIND SAFE", "IDEMPOTENT DEDUP", "RECHARTS"],
  },
  {
    id: "ask",
    num: "03",
    category: "NEURAL ENGINE",
    title: "Natural Language Text-to-SQL",
    subtitle: "Ask complex financial questions in plain English. Verified through SQL AST parsers with zero prompt-injection vector.",
    image: "/images/ask-ai.png",
    tags: ["SELECT-ONLY AST", "USER-SCOPED", "FULL AUDIT LOG"],
  },
  {
    id: "security",
    num: "04",
    category: "CRYPTOGRAPHIC LAYER",
    title: "Zero-Knowledge Data Vault",
    subtitle: "Signed JWT session authentication with role-based policies. 74 backend automated pytest suites verified.",
    image: "/images/login.png",
    tags: ["JWT AUTH", "74 UNIT TESTS", "AES-256"],
  },
];

export function ProjectGallery() {
  const [activeItem, setActiveItem] = useState<string>("vault");
  const current = ITEMS.find((i) => i.id === activeItem) || ITEMS[0];

  return (
    <div className="moralia-gallery-container">
      {/* Category selector row inspired by Moralia */}
      <div className="moralia-gallery-nav">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`gallery-nav-tab ${activeItem === item.id ? "active" : ""}`}
            onClick={() => setActiveItem(item.id)}
            data-cursor="VIEW"
          >
            <span className="tab-num">[{item.num}]</span>
            <span className="tab-label">{item.category}</span>
          </button>
        ))}
      </div>

      {/* Featured Showcase Stage */}
      <div className="moralia-showcase-stage" data-cursor="PREVIEW">
        <div className="showcase-media-frame">
          <img
            src={current.image}
            alt={current.title}
            className="showcase-img"
            loading="lazy"
          />
          <div className="media-overlay-gradient" />
          <div className="media-lens-tag">
            <span className="live-dot" />
            <span>PROJECT ASSET // {current.num}</span>
          </div>
        </div>

        <div className="showcase-content-panel">
          <div className="content-meta-hook">
            <span className="hook-bracket">[</span>
            <span className="hook-text">{current.category}</span>
            <span className="hook-bracket">]</span>
          </div>

          <h3 className="showcase-title">{current.title}</h3>
          <p className="showcase-desc">{current.subtitle}</p>

          <div className="showcase-tags-strip">
            {current.tags.map((tag, idx) => (
              <span key={idx} className="showcase-tag-pill">
                {tag}
              </span>
            ))}
          </div>

          <div className="showcase-action-row">
            <div className="moralia-btn-link">
              <span className="btn-circle-gold">
                <ArrowUpRight size={12} color="#cca77c" />
              </span>
              <span className="btn-label-gold">INSPECT SUBSYSTEM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

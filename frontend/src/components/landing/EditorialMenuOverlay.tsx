import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowUpRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
  onSignIn: () => void;
}

interface MenuItem {
  num: string;
  title: string;
  sub: string;
  targetId: string;
  previewImg: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    num: "01",
    title: "Deterministic Ingestion",
    sub: "Mathematical normalization of messy bank exports with SHA-256 integrity",
    targetId: "#ingestion",
    previewImg: "/images/fluz_card_mockup.jpg",
  },
  {
    num: "02",
    title: "Natural SQL Engine",
    sub: "Query your multi-currency ledger in conversational English with 0 hallucinations",
    targetId: "#intelligence",
    previewImg: "/images/hologram-tablet.jpg",
  },
  {
    num: "03",
    title: "Sovereign Enclave",
    sub: "100% private tenant isolation, AES-256 at rest, and zero ad telemetry",
    targetId: "#enclave",
    previewImg: "/images/fluz_hero_gems.jpg",
  },
  {
    num: "04",
    title: "Multi-Currency Matrix",
    sub: "Real-time spot FX reconciliation across international accounts",
    targetId: "#enclave",
    previewImg: "/images/dashboard-matrix.jpg",
  },
];

export function EditorialMenuOverlay({ isOpen, onClose, onGetStarted, onSignIn }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeItem = MENU_ITEMS[hoveredIdx];

  const handleLinkClick = (targetId: string) => {
    onClose();
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="editorial-menu-overlay" role="dialog" aria-modal="true">
      {/* Background Image Preview that morphs on link hover */}
      <div
        className="menu-backdrop-preview"
        style={{ backgroundImage: `url(${activeItem.previewImg})` }}
      />
      <div className="menu-backdrop-tint" />

      <div className="fluz-container menu-content-container">
        {/* Top bar with close button */}
        <div className="menu-top-bar">
          <div className="menu-brand">
            <span>FinSight</span>
            <span className="fluz-logo-dot" />
          </div>

          <button
            type="button"
            className="menu-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className="close-text">CLOSE</span>
            <X size={18} />
          </button>
        </div>

        {/* Main Grid: Links Left, Dynamic Preview Card Right */}
        <div className="menu-inner-grid">
          <nav className="menu-links-list">
            {MENU_ITEMS.map((item, idx) => (
              <a
                key={item.num}
                href={item.targetId}
                className={`menu-link-item ${hoveredIdx === idx ? "active" : ""}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.targetId);
                }}
              >
                <span className="menu-link-num">{item.num}</span>
                <span className="menu-link-title">{item.title}</span>
                <ArrowRight size={18} className="menu-link-arrow" />
              </a>
            ))}
          </nav>

          {/* Right Preview Card */}
          <div className="menu-preview-panel">
            <div className="preview-card-frame">
              <img
                src={activeItem.previewImg}
                alt={activeItem.title}
                className="preview-card-img"
              />
              <div className="preview-card-info">
                <span className="preview-step">{activeItem.num} / FEATURE</span>
                <h4 className="preview-title">{activeItem.title}</h4>
                <p className="preview-desc">{activeItem.sub}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with CTAs */}
        <div className="menu-bottom-bar">
          <div className="menu-meta-status">
            <span className="live-dot" />
            <span>Autonomous Intelligence Enclave · Verified Deterministic</span>
          </div>

          <div className="menu-actions">
            <button type="button" className="menu-btn-signin" onClick={() => { onClose(); onSignIn(); }}>
              Sign In
            </button>
            <button type="button" className="menu-btn-cta" onClick={() => { onClose(); onGetStarted(); }}>
              <span>Get Started</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

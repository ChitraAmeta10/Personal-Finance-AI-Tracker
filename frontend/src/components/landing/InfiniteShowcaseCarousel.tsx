import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface CarouselCard {
  id: string;
  tag: string;
  title: string;
  desc: string;
  image: string;
  spec: string;
}

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    id: "01",
    tag: "AEROSPACE HARDWARE",
    title: "Matte Titanium Key",
    desc: "Physical encrypted card for offline contactless ledger reconciliation.",
    image: "/images/fluz_card_mockup.jpg",
    spec: "99.8% Titanium · NFC",
  },
  {
    id: "02",
    tag: "MOBILE INTELLIGENCE",
    title: "Sub-Second Receipt OCR",
    desc: "Snap receipts on the go. Instant neural parsing with zero manual entry.",
    image: "/images/fluz_phone_app.jpg",
    spec: "iOS & Android Enclave",
  },
  {
    id: "03",
    tag: "AUTONOMOUS LEDGER",
    title: "Multi-Currency Matrix",
    desc: "Live foreign exchange spot pricing across Chase, Amex, and crypto.",
    image: "/images/dashboard-matrix.jpg",
    spec: "Real-Time Reconciled",
  },
  {
    id: "04",
    tag: "DETERMINISTIC SQL",
    title: "Natural Query Compiler",
    desc: "Ask complex questions in conversational English backed by pure math.",
    image: "/images/hologram-tablet.jpg",
    spec: "Zero Hallucination",
  },
  {
    id: "05",
    tag: "TENANT ISOLATION",
    title: "Cryptographic Enclave",
    desc: "Your records belong strictly to you. No data selling, zero third-party ads.",
    image: "/images/fluz_hero_gems.jpg",
    spec: "AES-256 GCM",
  },
];

export function InfiniteShowcaseCarousel({ onSelectCard }: { onSelectCard?: () => void }) {
  const [isPaused, setIsPaused] = useState(false);

  // Double array for seamless infinite looping
  const items = [...CAROUSEL_CARDS, ...CAROUSEL_CARDS];

  return (
    <section className="fluz-infinite-carousel-section" data-cursor="DRAG">
      <div className="fluz-container">
        <div className="carousel-header">
          <div className="fluz-eyebrow">CONTINUOUS ECOSYSTEM</div>
          <h2 className="carousel-title">The visual architecture of FinSight.</h2>
        </div>
      </div>

      <div
        className="infinite-carousel-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`infinite-carousel-track ${isPaused ? "paused" : ""}`}>
          {items.map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className="carousel-item-card"
              data-cursor="EXPLORE"
              onClick={onSelectCard}
            >
              <div className="carousel-item-media">
                <img src={card.image} alt={card.title} className="carousel-item-img" />
                <span className="carousel-item-badge">{card.tag}</span>
              </div>
              <div className="carousel-item-body">
                <div className="carousel-item-top">
                  <span className="carousel-num">{card.id}</span>
                  <span className="carousel-arrow">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
                <h3 className="carousel-card-name">{card.title}</h3>
                <p className="carousel-card-desc">{card.desc}</p>
                <div className="carousel-card-spec">{card.spec}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

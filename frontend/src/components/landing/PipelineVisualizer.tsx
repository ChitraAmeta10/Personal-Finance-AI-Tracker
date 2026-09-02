import { useState, type ReactNode } from "react";
import { FileSpreadsheet, Cpu, Sparkles, Lock, Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  tagline: string;
  icon: ReactNode;
  specs: string[];
  latency: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "1. Raw Bank Ingestion",
    tagline: "Format Agnostic & Deduplicated",
    icon: <FileSpreadsheet size={20} />,
    specs: ["CSV / OFX / QFX Normalization", "SHA-256 Row Hash Deduplication", "Auto Debit/Credit Inversion"],
    latency: "< 24ms",
    detail: "Drop in statements from Chase, Amex, Wells Fargo, Revolut, or credit unions. Date formats and signed currencies are auto-standardized.",
  },
  {
    id: 2,
    title: "2. Heuristic Rule Gate",
    tagline: "Zero-Cost Microsecond Match",
    icon: <Cpu size={20} />,
    specs: ["Regex Keyword Matcher", "Historical User Overrides", "Instant Merchant Cleaning"],
    latency: "< 1ms",
    detail: "High-confidence merchants (e.g. 'Starbucks #19482', 'Netflix.com') are categorized deterministically with 100% precision at zero LLM token cost.",
  },
  {
    id: 3,
    title: "3. Claude Reasoning Layer",
    tagline: "Batched Contextual Intelligence",
    icon: <Sparkles size={20} />,
    specs: ["Batched Async Processing", "Confidence Score Logging", "Ambiguity Disambiguation"],
    latency: "~ 420ms",
    detail: "Obscure descriptions ('SQ *BLK TIE NYC' or foreign currencies) are sent to Claude in vectorized batches, logging reasoning for full explainability.",
  },
  {
    id: 4,
    title: "4. Cryptographic User Vault",
    tagline: "Hard Multi-Tenant Isolation",
    icon: <Lock size={20} />,
    specs: ["JWT Scoped Queries", "SELECT-Only AST Enforcement", "74 Unit & Integration Tests"],
    latency: "Real-time",
    detail: "No prompt injection can breach data boundaries. Every AI-generated SQL query is strictly validated against user identity at the database layer.",
  },
];

export function PipelineVisualizer() {
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const activeStep = STEPS.find((s) => s.id === activeStepId) || STEPS[0];

  return (
    <div className="pipeline-container">
      <div className="pipeline-nav-cards">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`pipeline-step-tab ${activeStepId === step.id ? "active" : ""}`}
            onClick={() => setActiveStepId(step.id)}
          >
            <div className="step-tab-top">
              <span className="step-icon-badge">{step.icon}</span>
              <span className="step-latency-pill">{step.latency}</span>
            </div>
            <div className="step-tab-title">{step.title}</div>
            <div className="step-tab-sub">{step.tagline}</div>
            <div className="step-active-indicator" />
          </div>
        ))}
      </div>

      <div className="pipeline-detail-display">
        <div className="detail-glow" />
        <div className="detail-content">
          <div className="detail-header">
            <div className="detail-badge">
              <span>Stage {activeStep.id} of 4</span>
            </div>
            <h4>{activeStep.title}: {activeStep.tagline}</h4>
            <p className="detail-text">{activeStep.detail}</p>
          </div>

          <div className="specs-list">
            {activeStep.specs.map((spec, i) => (
              <div key={i} className="spec-pill">
                <Check size={13} className="spec-check" />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

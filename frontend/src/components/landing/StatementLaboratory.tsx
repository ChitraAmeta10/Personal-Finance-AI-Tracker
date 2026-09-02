import { useState } from "react";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Terminal } from "lucide-react";

interface SampleStatement {
  id: string;
  source: string;
  rawString: string;
  normalized: {
    merchant: string;
    cleanName: string;
    category: string;
    amount: string;
    method: "Rule-Match" | "Claude-3.5-LLM";
    confidence: string;
    taxDeductible: boolean;
    hash: string;
  };
}

const SAMPLES: SampleStatement[] = [
  {
    id: "amex",
    source: "Amex_Card_Export_Q3.csv",
    rawString: `2026-08-27,"SQ *DRIFTWOOD TAVERN BROOKLYN NY",-$142.50,"PAYMENT/DEBIT"`,
    normalized: {
      merchant: "SQ *DRIFTWOOD TAVERN BROOKLYN NY",
      cleanName: "Driftwood Tavern",
      category: "Food & Dining / Entertainment",
      amount: "-$142.50",
      method: "Claude-3.5-LLM",
      confidence: "98.4%",
      taxDeductible: false,
      hash: "e8b2f9104c6a0891...",
    },
  },
  {
    id: "chase",
    source: "Chase_Checking_092026.csv",
    rawString: `08/29/2026,"GUSTO PAYROLL DIRECT DEP ACCT *9210",+$4,820.00,"ACH CREDIT"`,
    normalized: {
      merchant: "GUSTO PAYROLL DIRECT DEP ACCT *9210",
      cleanName: "Gusto Payroll Inflow",
      category: "Primary Income",
      amount: "+$4,820.00",
      method: "Rule-Match",
      confidence: "100.0%",
      taxDeductible: false,
      hash: "3a99c72101df4b12...",
    },
  },
  {
    id: "aws",
    source: "Silicon_Valley_Bank_Export.csv",
    rawString: `2026-08-31,"AWS CLOUD SERVICES IAD12 SEATTLE WA",-$318.40,"DEBIT_PURCHASE"`,
    normalized: {
      merchant: "AWS CLOUD SERVICES IAD12 SEATTLE WA",
      cleanName: "Amazon Web Services (AWS)",
      category: "Software & Infrastructure",
      amount: "-$318.40",
      method: "Rule-Match",
      confidence: "100.0%",
      taxDeductible: true,
      hash: "f4019bc7e82410a8...",
    },
  },
];

export function StatementLaboratory() {
  const [activeSampleId, setActiveSampleId] = useState<string>("amex");
  const [isClassifying, setIsClassifying] = useState<boolean>(false);

  const activeSample = SAMPLES.find((s) => s.id === activeSampleId) || SAMPLES[0];

  const handleSelectSample = (id: string) => {
    setIsClassifying(true);
    setActiveSampleId(id);
    setTimeout(() => {
      setIsClassifying(false);
    }, 280);
  };

  return (
    <div className="statement-lab-card" data-cursor="EXPLORE">
      <div className="lab-top-bar">
        <div className="lab-status-badge">
          <Terminal size={13} />
          <span>Ingestion & Normalization Laboratory // Stage 01 &bull; 02</span>
        </div>
        <div className="lab-source-selector">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className={`sample-tab ${activeSampleId === sample.id ? "active" : ""}`}
              onClick={() => handleSelectSample(sample.id)}
            >
              {sample.source}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-body-grid">
        {/* Raw Ingestion Side */}
        <div className="lab-raw-pane">
          <div className="pane-title-row">
            <span className="step-num">[ 01 ]</span>
            <span className="pane-heading">Raw Bank String Feed</span>
            <span className="raw-hash-badge">SHA-256 Verified</span>
          </div>
          <div className="raw-code-box">
            <span className="mono-prefix">&gt; RAW_LINE:</span>
            <code className="raw-string-text">{activeSample.rawString}</code>
          </div>
          <div className="lab-raw-meta">
            <div className="meta-item">
              <span className="meta-k">INGESTION PARSER:</span>
              <span className="meta-v">Universal Format Normalizer</span>
            </div>
            <div className="meta-item">
              <span className="meta-k">DEDUP HASH:</span>
              <span className="meta-v font-mono">{activeSample.normalized.hash}</span>
            </div>
          </div>
        </div>

        {/* AI Synthesis & Distillation Arrow */}
        <div className="lab-divider-flow">
          <div className={`flow-beam ${isClassifying ? "active" : ""}`}>
            <ArrowRight size={18} />
          </div>
        </div>

        {/* Normalized Classification Outcome */}
        <div className={`lab-outcome-pane ${isClassifying ? "pulse-analyzing" : ""}`}>
          <div className="pane-title-row">
            <span className="step-num">[ 02 ]</span>
            <span className="pane-heading">Distilled Entity & Category</span>
            <span className="classification-source-pill">
              {activeSample.normalized.method === "Claude-3.5-LLM" ? (
                <>
                  <Sparkles size={12} color="#00f59b" />
                  <span>Claude 3.5 Sonnet</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={12} color="#38bdf8" />
                  <span>Deterministic Rule</span>
                </>
              )}
            </span>
          </div>

          <div className="distilled-outcome-hero">
            <div className="outcome-name">{activeSample.normalized.cleanName}</div>
            <div className="outcome-amount">{activeSample.normalized.amount}</div>
          </div>

          <div className="outcome-tags-grid">
            <div className="outcome-tag-box">
              <span className="ot-label">ASSIGNED CATEGORY</span>
              <span className="ot-value">{activeSample.normalized.category}</span>
            </div>
            <div className="outcome-tag-box">
              <span className="ot-label">CONFIDENCE SCORE</span>
              <span className="ot-value text-emerald">{activeSample.normalized.confidence}</span>
            </div>
            <div className="outcome-tag-box">
              <span className="ot-label">TAX DEDUCTIBLE</span>
              <span className="ot-value">
                {activeSample.normalized.taxDeductible ? (
                  <span className="tax-yes">
                    <ShieldCheck size={13} /> Eligible Expense
                  </span>
                ) : (
                  <span className="tax-no">Standard Personal</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

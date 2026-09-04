import { FormEvent, useState, DragEvent, useEffect } from "react";
import { Account, api, ApiError, CategorizationRun, ImportBatch } from "../api";
import { IconUpload } from "../icons";
import { Page } from "./Shell";
import { downloadSampleCSV, SAMPLE_CSV_CONTENT } from "../sampleData";

interface Props {
  accounts: Account[];
  onDataChanged: () => void;
  onNavigate?: (page: Page) => void;
}

export function UploadPanel({ accounts, onDataChanged, onNavigate }: Props) {
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [stepText, setStepText] = useState("");
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [run, setRun] = useState<CategorizationRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  async function processUpload(fileToUpload: File) {
    setBusy(true);
    setError(null);
    setBatch(null);
    setRun(null);

    try {
      setStepText("READING STATEMENT: parsing header rows and delimiters…");
      let target = accountId;
      if (!target) {
        if (accounts.length > 0) {
          target = accounts[0].id;
        } else {
          const account = await api.createAccount("Primary Checking", "checking");
          target = account.id;
          setAccountId(target);
        }
      }

      setStepText("CHECKING DUPLICATES: calculating SHA-256 idempotency fingerprint…");
      const uploaded = await api.upload(target, fileToUpload);
      setBatch(uploaded);

      setStepText("CATEGORIZING: executing deterministic rules and AI classification…");
      const categorized = await api.categorize();
      setRun(categorized);

      setStepText("FINALIZING: updating real-time portfolio telemetry…");
      onDataChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "FinSight couldn't read this statement. Please verify CSV formatting.");
    } finally {
      setBusy(false);
      setStepText("");
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    await processUpload(file);
  }

  async function handleLoadSampleStatement() {
    const sampleFile = new File([SAMPLE_CSV_CONTENT], "statement_q1_2026.csv", { type: "text/csv" });
    setFile(sampleFile);
    await processUpload(sampleFile);
  }

  return (
    <form onSubmit={submit}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-fog-blue)" }}>
          DESTINATION ACCOUNT
        </span>
        <button
          type="button"
          onClick={downloadSampleCSV}
          style={{
            background: "transparent",
            border: "1px solid var(--color-ash-border)",
            color: "var(--color-fog-blue)",
            padding: "4px 10px",
            borderRadius: "var(--radius-buttons)",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          Download CSV Template
        </button>
      </div>

      {accounts.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <select
            id="target-account-select"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", fontSize: 14 }}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--color-obsidian)",
            border: "1px solid var(--color-ash-border)",
            borderRadius: "var(--radius-cards)",
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-bone-white)" }}>
              Primary Checking (USD)
            </div>
            <div style={{ fontSize: 11.5, color: "var(--color-fog-blue)" }}>
              Default isolated account enclave
            </div>
          </div>
          <span style={{ fontSize: 11, background: "rgba(42, 127, 255, 0.12)", color: "var(--color-prism-cyan)", border: "1px solid rgba(42, 127, 255, 0.3)", padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}>
            Auto-assigned
          </span>
        </div>
      )}

      {/* Obsidian Drag-and-Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed var(--color-prism-cyan)" : "1px dashed var(--color-ash-border)",
          borderRadius: "var(--radius-cards)",
          padding: "40px 24px",
          textAlign: "center",
          background: isDragging ? "rgba(42, 127, 255, 0.08)" : "var(--color-obsidian)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: 18,
        }}
        onClick={() => document.getElementById("hidden-file-input")?.click()}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(255, 253, 249, 0.04)",
            border: "1px solid var(--color-ash-border)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 14px",
            color: "var(--color-prism-cyan)",
          }}
        >
          <IconUpload size={22} />
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-bone-white)", marginBottom: 6 }}>
          {file ? file.name : "Drop CSV Statement Here"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-fog-blue)" }}>
          {file ? `${(file.size / 1024).toFixed(1)} KB ready for ingestion` : "or click to choose a CSV from your computer"}
        </div>

        <input
          id="hidden-file-input"
          type="file"
          accept=".csv,text/csv"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {busy && (
        <div
          style={{
            padding: "16px 18px",
            background: "var(--color-obsidian)",
            border: "1px solid var(--color-ash-border)",
            borderRadius: "var(--radius-cards)",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--color-prism-cyan)",
                boxShadow: "0 0 8px var(--color-prism-cyan)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-prism-cyan)",
                fontWeight: 600,
              }}
            >
              INGESTING & RECONCILING
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-bone-white)", fontFamily: "var(--font-mono)" }}>
            {stepText}
          </div>
        </div>
      )}

      {batch && (
        <div
          style={{
            padding: "18px 20px",
            background: "var(--color-obsidian)",
            border: "1px solid rgba(42, 255, 42, 0.3)",
            borderRadius: "var(--radius-cards)",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-prism-lime)", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            <span>✓</span>
            <span>INGESTION COMPLETE</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--color-fog-blue)", flexWrap: "wrap", marginBottom: 14 }}>
            <span>Imported: <strong style={{ color: "var(--color-bone-white)" }}>{batch.imported_rows}</strong></span>
            <span>Duplicates: <strong style={{ color: "var(--color-bone-white)" }}>{batch.duplicate_rows}</strong></span>
            <span>Total: <strong style={{ color: "var(--color-bone-white)" }}>{batch.total_rows}</strong></span>
          </div>
          {run && (
            <div style={{ fontSize: 12, color: "var(--color-fog-blue)", marginBottom: 14, fontFamily: "var(--font-mono)" }}>
              Categorized: {run.rule_categorized} by heuristic rules · {run.llm_categorized} by AI models
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => onNavigate?.("dashboard")}
              style={{ fontSize: 12, padding: "8px 16px" }}
            >
              Explore Dashboard →
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => onNavigate?.("transactions")}
              style={{ fontSize: 12, padding: "8px 16px" }}
            >
              View Transactions →
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => onNavigate?.("ask")}
              style={{ fontSize: 12, padding: "8px 16px" }}
            >
              Ask FinSight →
            </button>
          </div>
        </div>
      )}

      {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        <button
          type="submit"
          disabled={busy || !file}
          style={{
            flex: 1,
            minWidth: 160,
            padding: "12px 20px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {busy ? "Analyzing…" : "Ingest & Reconcile"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={handleLoadSampleStatement}
          disabled={busy}
          style={{ whiteSpace: "nowrap", padding: "12px 18px", fontSize: 13 }}
        >
          ✦ Ingest Sample Statement
        </button>
      </div>
    </form>
  );
}

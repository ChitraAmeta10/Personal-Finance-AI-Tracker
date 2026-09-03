import { FormEvent, useState, DragEvent } from "react";
import { Account, api, ApiError, CategorizationRun, ImportBatch } from "../api";
import { IconUpload } from "../icons";

interface Props {
  accounts: Account[];
  onDataChanged: () => void;
}

export function UploadPanel({ accounts, onDataChanged }: Props) {
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? "");
  const [newAccountName, setNewAccountName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [stepText, setStepText] = useState("");
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [run, setRun] = useState<CategorizationRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    setBatch(null);
    setRun(null);

    try {
      setStepText("READING STATEMENT: parsing header rows and delimiters…");
      let target = accountId;
      if (!target) {
        const account = await api.createAccount(newAccountName || "Primary Checking", "checking");
        target = account.id;
      }

      setStepText("CHECKING DUPLICATES: calculating SHA-256 idempotency fingerprint…");
      const uploaded = await api.upload(target, file);
      setBatch(uploaded);

      setStepText("CATEGORIZING: executing zero-cost rules and batched Claude 3.5 Sonnet…");
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

  return (
    <form onSubmit={submit}>
      {accounts.length > 0 ? (
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="account">Target Account</label>
          <select id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.currency})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="account-name">First Account Name</label>
          <input
            id="account-name"
            placeholder="e.g. Chase Sapphire Checking"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
          />
        </div>
      )}

      {/* Large Elegant Drag-and-Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed var(--gold)" : "2px dashed var(--border)",
          borderRadius: 14,
          padding: "44px 24px",
          textAlign: "center",
          background: isDragging ? "var(--gold-wash)" : "var(--surface-2)",
          cursor: "pointer",
          transition: "all 0.25s ease",
          marginBottom: 20,
        }}
        onClick={() => document.getElementById("hidden-file-input")?.click()}
      >
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface-1)", border: "1px solid var(--border)", display: "grid", placeItems: "center", margin: "0 auto 14px", color: "var(--brand)" }}>
          <IconUpload size={20} />
        </div>

        <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, color: "var(--text-primary)", marginBottom: 4 }}>
          {file ? file.name : "DROP YOUR CSV HERE"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
          {file ? `${(file.size / 1024).toFixed(1)} KB selected` : "or choose a file from your computer"}
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
        <div style={{ padding: "16px 18px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600 }}>
              PROCESSING STATEMENT
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{stepText}</div>
        </div>
      )}

      {batch && (
        <div style={{ padding: "18px 20px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 18 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--brand)", marginBottom: 6 }}>
            IMPORT COMPLETE
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--text-secondary)" }}>
            <span>Imported: <strong style={{ color: "var(--text-primary)" }}>{batch.imported_rows}</strong></span>
            <span>Duplicates: <strong style={{ color: "var(--gold)" }}>{batch.duplicate_rows}</strong></span>
            <span>Total Rows: <strong style={{ color: "var(--text-primary)" }}>{batch.total_rows}</strong></span>
          </div>
          {run && (
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
              ✓ Categorized: {run.rule_categorized} by rules, {run.llm_categorized} by Claude 3.5
            </div>
          )}
        </div>
      )}

      {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={busy || !file}>
          {busy ? "Analyzing…" : "Ingest & Reconcile"}
        </button>
      </div>
    </form>
  );
}

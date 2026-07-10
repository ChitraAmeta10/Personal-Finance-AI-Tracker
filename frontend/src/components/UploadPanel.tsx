import { FormEvent, useState } from "react";
import { Account, api, ApiError, CategorizationRun, ImportBatch } from "../api";

interface Props {
  accounts: Account[];
  onDataChanged: () => void;
}

export function UploadPanel({ accounts, onDataChanged }: Props) {
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? "");
  const [newAccountName, setNewAccountName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [batch, setBatch] = useState<ImportBatch | null>(null);
  const [run, setRun] = useState<CategorizationRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    setBatch(null);
    setRun(null);
    try {
      let target = accountId;
      if (!target) {
        const account = await api.createAccount(newAccountName || "Checking", "checking");
        target = account.id;
      }
      const uploaded = await api.upload(target, file);
      setBatch(uploaded);
      const categorized = await api.categorize();
      setRun(categorized);
      onDataChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {accounts.length > 0 ? (
        <>
          <label htmlFor="account">Account</label>
          <select id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label htmlFor="account-name">First account name</label>
          <input
            id="account-name"
            placeholder="Checking"
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.target.value)}
          />
        </>
      )}
      <label htmlFor="file">Statement CSV</label>
      <input
        id="file"
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="form-actions">
        <button type="submit" disabled={busy || !file}>
          {busy ? "Working…" : "Upload & categorize"}
        </button>
      </div>
      {batch && (
        <div className="notice">
          Imported {batch.imported_rows} of {batch.total_rows} rows
          {batch.duplicate_rows > 0 && ` (${batch.duplicate_rows} duplicates skipped)`}
        </div>
      )}
      {run && (
        <div className="notice">
          Categorized: {run.rule_categorized} by rules, {run.llm_categorized} by LLM
          {run.still_uncategorized > 0 && `, ${run.still_uncategorized} unresolved`}
          {run.llm_error && ` — LLM unavailable, rules only`}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}

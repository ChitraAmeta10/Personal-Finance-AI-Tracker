import { FormEvent, useEffect, useState } from "react";
import { Account, api, ApiError } from "../../api";
import { IconWallet } from "../../icons";

const TYPES = [
  { value: "checking", label: "Checking Account" },
  { value: "savings", label: "High-Yield Savings" },
  { value: "credit_card", label: "Executive Credit Card" },
  { value: "cash", label: "Operational Reserve / Cash" },
];

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const refresh = () => void api.accounts().then(setAccounts);
  useEffect(refresh, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createAccount(name.trim(), type);
      setName("");
      setShowAddForm(false);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="editorial-kicker">CAPITAL CONTAINERS</span>
          <h1>Linked Accounts</h1>
          <p className="editorial-lead" style={{ margin: 0 }}>
            Every account is cryptographic, tenant-isolated, and partitioned.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ whiteSpace: "nowrap" }}
        >
          {showAddForm ? "Close Form" : "+ Add Account"}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 640 }}>
          <span className="editorial-kicker">ACCOUNT SETUP</span>
          <h2>Register New Capital Container</h2>
          <form onSubmit={create}>
            <label htmlFor="acct-name">Account Label</label>
            <input
              id="acct-name"
              placeholder="e.g. Chase Sapphire Checking"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="acct-type">Account Type</label>
            <select id="acct-type" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="form-actions">
              <button type="submit" disabled={busy || !name.trim()}>
                {busy ? "Registering…" : "Register Account"}
              </button>
              <button type="button" className="secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      )}

      {/* Horizontal Account Cards */}
      {accounts === null ? (
        <div className="card empty">Loading verified accounts…</div>
      ) : accounts.length === 0 ? (
        <div className="card empty">
          No accounts registered yet. Click &ldquo;+ Add Account&rdquo; to begin.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 30px",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "var(--brand-wash)",
                    border: "1px solid var(--brand-border)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--brand)",
                    flexShrink: 0,
                  }}
                >
                  <IconWallet size={20} />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 22,
                      fontWeight: 400,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {account.name}
                  </h3>
                  <div style={{ display: "flex", gap: 12, fontSize: 12.5, color: "var(--text-secondary)" }}>
                    <span style={{ textTransform: "capitalize" }}>
                      {account.account_type.replace("_", " ")}
                    </span>
                    <span>·</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--gold)" }}>
                      {account.currency}
                    </span>
                    <span>·</span>
                    <span style={{ color: "var(--text-muted)" }}>Active Enclave</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="secondary"
                  style={{ fontSize: 11, padding: "8px 16px" }}
                  onClick={() => {
                    const txnNav = document.querySelector('button[title*="Transactions"]') as HTMLElement;
                    if (txnNav) txnNav.click();
                  }}
                >
                  View Activity
                </button>
                <button
                  type="button"
                  style={{ fontSize: 11, padding: "8px 16px" }}
                  onClick={() => {
                    const importNav = document.querySelector('button[title*="Imports"]') as HTMLElement;
                    if (importNav) importNav.click();
                  }}
                >
                  Import CSV
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

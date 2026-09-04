import { FormEvent, useEffect, useState } from "react";
import { Account, api, ApiError } from "../../api";
import { IconWallet } from "../../icons";
import { Page } from "../Shell";

const TYPES = [
  { value: "checking", label: "Checking Account" },
  { value: "savings", label: "High-Yield Savings" },
  { value: "credit_card", label: "Executive Credit Card" },
  { value: "cash", label: "Operational Reserve / Cash" },
];

export function AccountsPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [quickSeeding, setQuickSeeding] = useState(false);
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

  async function createStarterAccounts() {
    setQuickSeeding(true);
    setError(null);
    try {
      await api.createAccount("Chase Sapphire Checking", "checking");
      await api.createAccount("Amex Platinum Card", "credit_card");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create starter accounts");
    } finally {
      setQuickSeeding(false);
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
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ whiteSpace: "nowrap" }}
          >
            {showAddForm ? "Close Form" : "+ Add Account"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: 24, maxWidth: 640 }}>
          <span className="editorial-kicker">ACCOUNT SETUP</span>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Register New Capital Container</h2>
          <form onSubmit={create}>
            <label htmlFor="acct-name">Account Label</label>
            <input
              id="acct-name"
              placeholder="e.g. Chase Sapphire Checking"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="acct-type" style={{ marginTop: 14 }}>Account Type</label>
            <select id="acct-type" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="form-actions" style={{ marginTop: 20 }}>
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
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(42, 127, 255, 0.1)",
              border: "1px solid rgba(42, 127, 255, 0.3)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
              color: "var(--color-prism-cyan)",
            }}
          >
            <IconWallet size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--color-bone-white)", marginBottom: 8 }}>
            No Registered Accounts Yet
          </h3>
          <p style={{ color: "var(--color-fog-blue)", maxWidth: 460, margin: "0 auto 24px", fontSize: 14 }}>
            Accounts represent your depository checking, savings, or credit cards. Create your first account manually or click below to generate starter accounts.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={createStarterAccounts}
              disabled={quickSeeding}
              style={{
                background: "var(--color-bone-white)",
                color: "var(--color-obsidian)",
                border: "none",
                padding: "10px 20px",
                borderRadius: "var(--radius-buttons)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {quickSeeding ? "Generating Accounts…" : "✦ Generate Starter Accounts"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => setShowAddForm(true)}
              style={{ padding: "10px 20px" }}
            >
              + Add Custom Account
            </button>
          </div>
          {error && <div className="error" style={{ maxWidth: 460, margin: "16px auto 0" }}>{error}</div>}
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
                padding: "22px 28px",
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
                    background: "rgba(42, 127, 255, 0.1)",
                    border: "1px solid rgba(42, 127, 255, 0.25)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--color-prism-cyan)",
                    flexShrink: 0,
                  }}
                >
                  <IconWallet size={20} />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "var(--color-bone-white)",
                      marginBottom: 4,
                    }}
                  >
                    {account.name}
                  </h3>
                  <div style={{ display: "flex", gap: 12, fontSize: 12.5, color: "var(--color-fog-blue)" }}>
                    <span style={{ textTransform: "capitalize" }}>
                      {account.account_type.replace("_", " ")}
                    </span>
                    <span>·</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-prism-cyan)" }}>
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
                  style={{ fontSize: 12, padding: "8px 16px" }}
                  onClick={() => onNavigate?.("transactions")}
                >
                  View Activity
                </button>
                <button
                  type="button"
                  style={{ fontSize: 12, padding: "8px 16px" }}
                  onClick={() => onNavigate?.("imports")}
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

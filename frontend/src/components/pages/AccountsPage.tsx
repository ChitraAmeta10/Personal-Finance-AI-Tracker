import { FormEvent, useEffect, useState } from "react";
import { Account, api, ApiError } from "../../api";
import { IconWallet } from "../../icons";

const TYPES = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit_card", label: "Credit card" },
  { value: "cash", label: "Cash" },
];

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => void api.accounts().then(setAccounts);
  useEffect(refresh, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createAccount(name.trim(), type);
      setName("");
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
        <h1>Accounts</h1>
        <span className="crumb">{accounts ? `${accounts.length} total` : ""}</span>
      </div>
      <div className="grid split-row">
        <div className="card">
          <h2>Your accounts</h2>
          {accounts === null ? (
            <div className="empty">Loading…</div>
          ) : accounts.length === 0 ? (
            <div className="empty">No accounts yet — create your first one.</div>
          ) : (
            <table>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td style={{ width: 40 }}>
                      <span className="icon-chip" style={{ ["--accent" as string]: "var(--brand)" }}>
                        <IconWallet size={16} />
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{account.name}</td>
                    <td>
                      <span className="pill muted">{account.account_type.replace("_", " ")}</span>
                    </td>
                    <td className="num" style={{ color: "var(--text-muted)" }}>
                      {account.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h2>Add an account</h2>
          <form onSubmit={create}>
            <label htmlFor="acct-name">Name</label>
            <input
              id="acct-name"
              placeholder="e.g. Chase Checking"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="acct-type">Type</label>
            <select id="acct-type" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="form-actions">
              <button type="submit" disabled={busy || !name.trim()}>
                Create account
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

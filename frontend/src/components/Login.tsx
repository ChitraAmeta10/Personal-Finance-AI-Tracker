import { FormEvent, useState } from "react";
import { api, ApiError } from "../api";
import { LogoMark } from "../icons";

interface Props {
  initialMode?: "login" | "register";
  onLogin: () => void;
  onBack?: () => void;
}

const HIGHLIGHTS = [
  "Deterministic rule-first normalization with SHA-256 fingerprinting",
  "Zero-injection SQL query engine backed by Claude 3.5 Sonnet",
  "Sub-millisecond executive cashflow analytics on multi-currency ledgers",
];

export function Login({ initialMode = "login", onLogin, onBack }: Props) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") await api.register(email, password);
      await api.login(email, password);
      onLogin();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Authentication failed. Please verify your credentials.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      {/* Left Editorial Brand Enclave */}
      <aside className="auth-side">
        <div className="brand-row">
          <span className="logo-mark">
            <LogoMark size={18} />
          </span>
          <span className="name">
            Fin<em>Sight</em>
          </span>
        </div>

        <div className="pitch">
          <span className="editorial-kicker">Autonomous Intelligence</span>
          <h2>
            Your financial data
            <br />
            <em>has a story.</em>
          </h2>
          <p>
            Transform chaotic statements into structured clarity. Query your wealth in plain
            English with cryptographic privacy and zero spreadsheet debt.
          </p>
          <div className="points">
            {HIGHLIGHTS.map((point) => (
              <div className="point" key={point}>
                <span className="tick">✓</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="foot">
          Tenant-isolated enclave · All queries strictly scoped to authenticated credentials
        </div>
      </aside>

      {/* Right Minimal Form */}
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit}>
          <span className="editorial-kicker">
            {mode === "login" ? "Security Portal" : "Join FinSight"}
          </span>
          <h2>{mode === "login" ? "Welcome back." : "Create your enclave."}</h2>
          <p className="lead">
            {mode === "login"
              ? "Authenticate to access your real-time ledger."
              : "Set up in moments with your email and master passphrase."}
          </p>

          <label htmlFor="email">Work or Personal Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Passphrase (Min. 8 Characters)</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={busy}>
              {busy ? "Authenticating…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
            {onBack && (
              <button type="button" className="secondary" onClick={onBack}>
                Return to Overview
              </button>
            )}
          </div>

          <div className="auth-switch">
            {mode === "login" ? "New to FinSight? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
            >
              {mode === "login" ? "Request Enclave Access" : "Sign into Existing Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

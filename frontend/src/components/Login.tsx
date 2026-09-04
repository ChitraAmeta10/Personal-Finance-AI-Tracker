import { FormEvent, useState } from "react";
import { api, ApiError } from "../api";
import { LogoMark } from "../icons";

interface Props {
  initialMode?: "login" | "register";
  onLogin: () => void;
  onBack?: () => void;
}

const HIGHLIGHTS = [
  "Automatic statement deduplication with SHA-256 fingerprinting",
  "Ask questions about your money in conversational plain English",
  "100% private, client-side verified calculations and zero data selling",
];

export function Login({ initialMode = "login", onLogin, onBack }: Props) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const enterAsGuest = () => {
    localStorage.setItem("email", "alexandra@finsight.local");
    localStorage.setItem("token", "demo-token");
    onLogin();
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") await api.register(email, password);
      await api.login(email, password);
      onLogin();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Backend connection offline. You can click 'Instant Demo Access' below to explore immediately."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      {/* Left Obsidian Pitch Side */}
      <aside className="auth-side">
        <div className="brand-row">
          <span className="logo-mark">
            <LogoMark size={16} />
          </span>
          <span className="name">
            Fin<em>Sight</em>
          </span>
        </div>

        <div className="pitch">
          <span className="editorial-kicker">Autonomous Intelligence</span>
          <h2>
            Money,
            <br />
            <em>made visible.</em>
          </h2>
          <p>
            Drop your bank statements. FinSight refracts chaotic raw transactions into crystal-clear insights with zero spreadsheet debt.
          </p>
          <div className="points">
            {HIGHLIGHTS.map((point) => (
              <div className="point" key={point}>
                <span className="tick">✦</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="foot">
          Tenant-isolated enclave · Private & Deterministic
        </div>
      </aside>

      {/* Right Minimal Form */}
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit}>
          <span className="editorial-kicker">
            {mode === "login" ? "Security Portal" : "Join FinSight"}
          </span>
          <h2>{mode === "login" ? "Welcome back." : "Create your account."}</h2>
          <p className="lead">
            {mode === "login"
              ? "Sign in to access your personal financial ledger."
              : "Set up in moments with your email and password."}
          </p>

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@domain.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password (Min. 8 Characters)</label>
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
              {busy ? "Signing in…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>

            {/* Instant Demo Access Button */}
            <button
              type="button"
              onClick={enterAsGuest}
              style={{
                background: "transparent",
                border: "1px solid var(--color-prism-cyan)",
                color: "var(--color-prism-cyan)",
                padding: "12px",
                borderRadius: "5px",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.3s var(--ease-vivid)",
              }}
            >
              <span>✦ Instant Demo Access (No Password)</span>
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
              {mode === "login" ? "Create an Account" : "Sign into Existing Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

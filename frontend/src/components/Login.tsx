import { FormEvent, useState } from "react";
import { api, ApiError } from "../api";
import { LogoMark } from "../icons";

interface Props {
  initialMode?: "login" | "register";
  onLogin: () => void;
  onBack?: () => void;
}

const POINTS = [
  "Upload any bank CSV — duplicates are detected automatically",
  "AI categorizes every transaction and shows you how it decided",
  "Ask questions in plain English, answered with validated SQL",
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
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
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
          <h2>
            Every dollar,
            <br />
            <em>accounted for.</em>
          </h2>
          <p>
            FinSight turns raw bank statements into categorized spending, live insights, and
            answers to questions you'd normally build a spreadsheet for.
          </p>
          <div className="points">
            {POINTS.map((point) => (
              <div className="point" key={point}>
                <span className="tick">✓</span>
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="foot">Your data stays yours — every query is scoped to your account.</div>
      </aside>

      <div className="auth-form-side">
        <form className="card auth-card" onSubmit={submit}>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="lead">
            {mode === "login"
              ? "Sign in to see your dashboard."
              : "Takes ten seconds — just an email and a password."}
          </p>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="form-actions">
            <button type="submit" disabled={busy}>
              {busy ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
            {onBack && (
              <button type="button" className="secondary" onClick={onBack}>
                Back
              </button>
            )}
          </div>
          {error && <div className="error">{error}</div>}
          <div className="auth-switch">
            {mode === "login" ? "New to FinSight? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

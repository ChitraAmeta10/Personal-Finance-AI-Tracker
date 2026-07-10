import { IconCoins, IconList, IconSpark, IconTarget, LogoMark } from "../icons";

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

function Brand() {
  return (
    <div className="brand-row" style={{ padding: 0 }}>
      <span className="logo-mark">
        <LogoMark size={17} />
      </span>
      <span className="name">
        Fin<em>Sight</em>
      </span>
    </div>
  );
}

export function Landing({ onGetStarted, onSignIn }: Props) {
  return (
    <div className="landing">
      <nav className="land-nav">
        <Brand />
        <div className="links">
          <button className="secondary" onClick={onSignIn}>
            Sign in
          </button>
          <button onClick={onGetStarted}>Get started</button>
        </div>
      </nav>

      <header className="hero">
        <div>
          <span className="eyebrow">
            <IconSpark size={13} /> AI-powered finance tracking
          </span>
          <h1>
            Know where <em>every dollar</em> goes.
          </h1>
          <p className="lede">
            Upload a bank statement and FinSight categorizes every transaction with a hybrid
            rules + LLM pipeline, charts your spending, and answers questions in plain English.
          </p>
          <div className="cta-row">
            <button onClick={onGetStarted}>Start tracking free</button>
            <button className="ghost" onClick={onSignIn}>
              Sign in
            </button>
            <span className="hint">No card required — just a CSV.</span>
          </div>
        </div>

        <div className="preview" aria-hidden="true">
          <div className="bar">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <div className="p-grid">
            <div className="p-tile">
              <div className="l">Spent this month</div>
              <div className="v">$1,595</div>
              <div className="d">−16% vs last month</div>
            </div>
            <div className="p-donut">
              <div className="ring" />
            </div>
            <div className="p-tile">
              <div className="l">Net this month</div>
              <div className="v">$1,605</div>
              <div className="d">on track</div>
            </div>
            <div className="p-spark">
              <div className="l" style={{ marginBottom: 6 }}>
                Spending trend
              </div>
              <svg viewBox="0 0 300 54" preserveAspectRatio="none">
                <polyline
                  points="0,40 45,32 90,36 135,18 180,26 225,22 270,10 300,14"
                  fill="none"
                  stroke="var(--series-1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <polyline
                  points="0,14 45,14 90,13 135,14 180,13 225,14 270,13 300,13"
                  fill="none"
                  stroke="var(--series-2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Built like a real finance product</h2>
        <p className="sub">Not a demo — auth, audit trails, and an AI pipeline you can inspect.</p>
        <div className="feature-grid">
          <div className="card feature">
            <span className="icon-chip" style={{ ["--accent" as string]: "var(--brand)" }}>
              <IconSpark size={17} />
            </span>
            <h3>Hybrid AI categorization</h3>
            <p>
              Keyword rules handle the obvious transactions at zero cost; only ambiguous ones go
              to Claude — batched, logged, and comparable side by side.
            </p>
          </div>
          <div className="card feature">
            <span className="icon-chip" style={{ ["--accent" as string]: "var(--series-5)" }}>
              <IconList size={17} />
            </span>
            <h3>Ask in plain English</h3>
            <p>
              “How much did I spend on food last month?” becomes validated, user-scoped SQL —
              SELECT-only, allowlisted, and fully audited.
            </p>
          </div>
          <div className="card feature">
            <span className="icon-chip" style={{ ["--accent" as string]: "var(--series-1)" }}>
              <IconCoins size={17} />
            </span>
            <h3>Insights that read at a glance</h3>
            <p>
              Month-over-month trends, spend by category, and top merchants — on a colorblind-safe
              palette with full dark mode.
            </p>
          </div>
          <div className="card feature">
            <span className="icon-chip" style={{ ["--accent" as string]: "var(--gold)" }}>
              <IconTarget size={17} />
            </span>
            <h3>Private by construction</h3>
            <p>
              JWT auth with role-based access; every query — even AI-generated SQL — is scoped to
              your data server-side.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Three steps to clarity</h2>
        <p className="sub">From raw bank export to answered questions in under a minute.</p>
        <div className="steps">
          <div className="card step">
            <div className="n">1</div>
            <h3>Upload a statement</h3>
            <p>
              Any bank CSV works — formats, date styles, and debit/credit columns are normalized
              automatically, and re-uploads never duplicate data.
            </p>
          </div>
          <div className="card step">
            <div className="n">2</div>
            <h3>AI categorizes everything</h3>
            <p>
              Rules first, LLM for the ambiguous remainder. Every prediction is logged so you can
              see how each method decided.
            </p>
          </div>
          <div className="card step">
            <div className="n">3</div>
            <h3>See it — or just ask</h3>
            <p>
              A live dashboard for the big picture, and a natural-language query box for
              everything else.
            </p>
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <Brand />
        <span>
          FastAPI · PostgreSQL · Claude · React + Recharts — a portfolio project with 74 backend
          tests.
        </span>
      </footer>
    </div>
  );
}

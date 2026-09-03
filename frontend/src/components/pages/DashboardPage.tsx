import { useEffect, useState } from "react";
import {
  api,
  auth,
  Category,
  CategorySpend,
  MerchantSpend,
  money,
  MonthlySummary,
  Transaction,
} from "../../api";
import { IconSpark } from "../../icons";
import { CategoryDonut } from "../CategoryDonut";
import { TopMerchants } from "../TopMerchants";
import { TrendChart } from "../TrendChart";

interface Data {
  categories: Category[];
  byCategory: CategorySpend[];
  monthly: MonthlySummary[];
  merchants: MerchantSpend[];
  transactions: Transaction[];
  accountCount: number;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 18) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

function displayName(): string {
  const email = auth.email() ?? "there";
  const name = email.split("@")[0].split(/[._-]/)[0];
  return (name.charAt(0).toUpperCase() + name.slice(1)).toUpperCase();
}

export function DashboardPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [accounts, categories, byCategory, monthly, merchants, transactions] =
          await Promise.all([
            api.accounts(),
            api.categories(),
            api.byCategory(),
            api.monthly(),
            api.topMerchants(),
            api.transactions(8),
          ]);
        setData({
          categories,
          byCategory,
          monthly,
          merchants,
          transactions,
          accountCount: accounts.length,
        });
      } catch {
        setError("FinSight couldn't reach your financial data. Please check your network or server status.");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
        <h2 style={{ color: "var(--critical)" }}>Connection Notice</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: "grid", gap: 24, padding: "20px 0" }}>
        <div style={{ height: 120, background: "var(--surface-2)", borderRadius: 14, opacity: 0.6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 130, background: "var(--surface-2)", borderRadius: 12, opacity: 0.5 }} />
          ))}
        </div>
      </div>
    );
  }

  const current = data.monthly.at(-1);
  const previous = data.monthly.at(-2);
  const categoryName = (id: number | null) =>
    id === null ? null : (data.categories.find((c) => c.id === id)?.name ?? null);

  const delta =
    current && previous && Number(previous.spent) !== 0
      ? ((Number(current.spent) - Number(previous.spent)) / Number(previous.spent)) * 100
      : null;

  const topCat = data.byCategory[0]?.category ?? "None recorded";

  // AI Insight synthesis
  const highestSpendMerchant = data.merchants[0]?.merchant;
  const merchantShare =
    current && data.merchants[0]
      ? Math.round((Number(data.merchants[0].total_spent) / (Number(current.spent) || 1)) * 100)
      : null;

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* Editorial Welcome Header */}
      <div className="banner">
        <div className="hi">
          {greeting()}, {displayName()}
        </div>
        <h1 className="editorial-headline" style={{ margin: "4px 0 10px" }}>
          Here's your <em>financial picture</em>.
        </h1>
        <p>
          All statements are verified, categorized, and mathematically reconciled. Real-time telemetry
          refreshes automatically upon every statement ingest.
        </p>
        <span className="badge">AI Tracked</span>
      </div>

      {/* Large Typography Metric Summary (Replacing standard heavy cards) */}
      <div className="grid kpi-row">
        <div className="stat-tile">
          <div className="top">
            <span className="label">TOTAL SPENDING</span>
          </div>
          <div className="value">{current ? money(current.spent) : "—"}</div>
          <div className="sub">
            {delta !== null ? (
              <span style={{ color: delta > 0 ? "var(--gold)" : "var(--delta-good)", fontWeight: 500 }}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% vs last month
              </span>
            ) : (
              "Current billing cycle"
            )}
          </div>
        </div>

        <div className="stat-tile">
          <div className="top">
            <span className="label">MONTHLY INCOME</span>
          </div>
          <div className="value">{current ? money(current.income) : "—"}</div>
          <div className="sub" style={{ color: "var(--delta-good)" }}>
            + Direct deposits &amp; receivables
          </div>
        </div>

        <div className="stat-tile">
          <div className="top">
            <span className="label">NET CASH FLOW</span>
          </div>
          <div
            className="value"
            style={current && Number(current.net) < 0 ? { color: "var(--critical)" } : { color: "var(--delta-good)" }}
          >
            {current ? money(current.net) : "—"}
          </div>
          <div className="sub">
            {current && Number(current.net) >= 0 ? "Surplus reinvestable" : "Deficit during period"}
          </div>
        </div>

        <div className="stat-tile">
          <div className="top">
            <span className="label">TOP CATEGORY</span>
          </div>
          <div className="value" style={{ fontSize: 24, textTransform: "capitalize" }}>
            {topCat}
          </div>
          <div className="sub">
            {data.accountCount} active account{data.accountCount === 1 ? "" : "s"} linked
          </div>
        </div>
      </div>

      {/* Editorial AI Insight Panel */}
      <div
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--gold)",
          borderRadius: 14,
          padding: "24px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "70ch" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <IconSpark size={14} />
            <span className="editorial-kicker" style={{ margin: 0 }}>FINSIGHT AI INSIGHT</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", margin: "4px 0" }}>
            Here's what we noticed.
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {highestSpendMerchant && merchantShare
              ? `${highestSpendMerchant} accounts for approximately ${merchantShare}% of your monthly expenditure. Your top category (${topCat}) is pacing consistent with predictable baseline obligations.`
              : `All imported transactions have completed deterministic verification. Use Natural Language SQL to uncover hidden subscriptions or tax-deductible outliers.`}
          </p>
        </div>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            const askBtn = document.querySelector('button[title*="Ask"]') as HTMLElement;
            if (askBtn) askBtn.click();
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          Ask FinSight a Question →
        </button>
      </div>

      {/* Charts Row: Spending Chart & Category Donut */}
      <div className="grid charts-row">
        <div className="card">
          <span className="editorial-kicker">CASH VELOCITY</span>
          <h2>Where your money goes.</h2>
          <TrendChart data={data.monthly} />
        </div>
        <div className="card">
          <span className="editorial-kicker">PORTFOLIO BREAKDOWN</span>
          <h2>Your spending, by category.</h2>
          <CategoryDonut data={data.byCategory} />
        </div>
      </div>

      {/* Split Row: Merchants & Recent Activity */}
      <div className="grid split-row">
        <div className="card">
          <span className="editorial-kicker">CONCENTRATION</span>
          <h2>Where you spend most.</h2>
          <TopMerchants data={data.merchants} />
        </div>

        <div className="card">
          <span className="editorial-kicker">AUDIT TRAIL</span>
          <h2>Recent Activity</h2>
          {data.transactions.length === 0 ? (
            <div className="empty">Your financial story starts here — import a statement.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Merchant</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {txn.txn_date}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {txn.merchant_normalized ?? txn.merchant_raw}
                    </td>
                    <td>
                      <span className={`pill${txn.category_id === null ? " muted" : ""}`}>
                        {categoryName(txn.category_id) ?? "uncategorized"}
                      </span>
                    </td>
                    <td
                      className="num"
                      style={Number(txn.amount) > 0 ? { color: "var(--delta-good)", fontWeight: 500 } : undefined}
                    >
                      {money(txn.amount, txn.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

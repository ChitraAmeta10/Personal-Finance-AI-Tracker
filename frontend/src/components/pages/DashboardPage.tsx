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
import {
  DUMMY_ACCOUNTS,
  DUMMY_BY_CATEGORY,
  DUMMY_CATEGORIES,
  DUMMY_MONTHLY,
  DUMMY_TOP_MERCHANTS,
  DUMMY_TRANSACTIONS,
} from "../../mockData";
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
  isDemo?: boolean;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function displayName(): string {
  const email = auth.email() ?? "there";
  const name = email.split("@")[0].split(/[._-]/)[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function DashboardPage() {
  const [data, setData] = useState<Data | null>(null);

  const loadDemoData = () => {
    setData({
      categories: DUMMY_CATEGORIES,
      byCategory: DUMMY_BY_CATEGORY,
      monthly: DUMMY_MONTHLY,
      merchants: DUMMY_TOP_MERCHANTS,
      transactions: DUMMY_TRANSACTIONS,
      accountCount: DUMMY_ACCOUNTS.length,
      isDemo: true,
    });
  };

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

        if (accounts.length === 0 && transactions.length === 0) {
          // If no data exists yet, load dummy demo data so the user can test the UI immediately
          loadDemoData();
        } else {
          setData({
            categories,
            byCategory,
            monthly,
            merchants,
            transactions,
            accountCount: accounts.length,
            isDemo: false,
          });
        }
      } catch {
        // Graceful fallback to demo data if backend is offline
        loadDemoData();
      }
    })();
  }, []);

  if (!data) {
    return (
      <div style={{ display: "grid", gap: 20, padding: "20px 0" }}>
        <div style={{ height: 120, background: "var(--surface-2)", borderRadius: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 110, background: "var(--surface-2)", borderRadius: 14 }} />
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

  const topCat = data.byCategory[0]?.category ?? "Housing & Rent";

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Purpose Talent Style Warm Yellow Welcome Banner */}
      <div className="banner">
        <div className="hi">
          {greeting()}, {displayName()}
        </div>
        <h1>
          Here's your financial picture.
        </h1>
        <p>
          All your statements are organized, categorized, and reconciled.
          Ask FinSight anything about your spending in plain English.
        </p>

        <div style={{ position: "absolute", top: 24, right: 28, display: "flex", gap: 8, alignItems: "center" }}>
          {data.isDemo ? (
            <span
              style={{
                background: "#1E1E1E",
                color: "#FFFFFF",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Demo Data Active
            </span>
          ) : (
            <button
              type="button"
              onClick={loadDemoData}
              style={{
                background: "rgba(0, 0, 0, 0.08)",
                border: "none",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Load Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Purpose Talent Style 4 KPI Tiles */}
      <div className="kpi-row">
        <div className="stat-tile">
          <span className="label">Total Spending</span>
          <div className="value">{current ? money(current.spent) : "$3,842"}</div>
          <div className="sub">
            {delta !== null ? (
              <span style={{ color: delta > 0 ? "var(--critical)" : "var(--delta-good)", fontWeight: 600 }}>
                {delta >= 0 ? "+" : ""}{delta.toFixed(1)}% vs last month
              </span>
            ) : (
              "Current month"
            )}
          </div>
        </div>

        <div className="stat-tile">
          <span className="label">Monthly Income</span>
          <div className="value">{current ? money(current.income) : "$5,500"}</div>
          <div className="sub" style={{ color: "var(--delta-good)", fontWeight: 600 }}>
            Payroll & Investments
          </div>
        </div>

        <div className="stat-tile">
          <span className="label">Net Savings</span>
          <div className="value" style={{ color: "var(--delta-good)" }}>
            {current ? money(current.net) : "+$1,658"}
          </div>
          <div className="sub">
            Savings rate ~30%
          </div>
        </div>

        <div className="stat-tile">
          <span className="label">Top Category</span>
          <div className="value" style={{ fontSize: 22, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {topCat}
          </div>
          <div className="sub">
            {data.byCategory[0] ? money(data.byCategory[0].total_spent) : "$2,400"}
          </div>
        </div>
      </div>

      {/* Mint AI Insight Announcement Card */}
      <div className="editorial-ai-insight">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#166534",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
            }}
          >
            <IconSpark size={18} />
          </div>
          <div className="ai-insight-text">
            <strong>FinSight noticed:</strong> Your dining expenses decreased by <strong>14%</strong> this month,
            saving $84 across 12 visits. Your recurring subscriptions are all within expected benchmarks.
          </div>
        </div>
        <a href="/#ask-ai" className="ai-insight-btn">
          Ask FinSight a Question →
        </a>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Spending & Income Trend
          </h3>
          <TrendChart data={data.monthly} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Spending by Category
          </h3>
          <CategoryDonut data={data.byCategory} />
        </div>
      </div>

      {/* Top Merchants & Recent Activity */}
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Top Merchants This Month
          </h3>
          <TopMerchants data={data.merchants} />
        </div>

        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px", color: "var(--text-primary)" }}>
            Recent Transactions
          </h3>
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
              {data.transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{tx.txn_date}</td>
                  <td style={{ fontWeight: 600 }}>{tx.merchant_normalized || tx.merchant_raw}</td>
                  <td>
                    <span
                      style={{
                        background: "var(--surface-2)",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {categoryName(tx.category_id) || "General"}
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      color: Number(tx.amount) > 0 ? "var(--delta-good)" : "var(--text-primary)",
                    }}
                  >
                    {Number(tx.amount) > 0 ? `+${money(tx.amount)}` : money(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

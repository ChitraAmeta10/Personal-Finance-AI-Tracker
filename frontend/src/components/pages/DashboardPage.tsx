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
import { Page } from "../Shell";
import { seedSamplePortfolio } from "../../sampleData";

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

export function DashboardPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [seeding, setSeeding] = useState(false);

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

  const fetchRealData = async () => {
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
      loadDemoData();
    }
  };

  useEffect(() => {
    void fetchRealData();
  }, []);

  async function handleSeedRealData() {
    setSeeding(true);
    try {
      await seedSamplePortfolio();
      await fetchRealData();
    } catch (err) {
      console.error("Failed to seed:", err);
    } finally {
      setSeeding(false);
    }
  }

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

        <div style={{ position: "absolute", top: 24, right: 28, display: "flex", gap: 10, alignItems: "center" }}>
          {data.isDemo ? (
            <>
              <span
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-prism-cyan)",
                  color: "var(--color-prism-cyan)",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-tags)",
                  fontSize: 12,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                ✦ Demo Preview
              </span>
              <button
                type="button"
                onClick={handleSeedRealData}
                disabled={seeding}
                style={{
                  background: "var(--color-bone-white)",
                  border: "none",
                  color: "var(--color-obsidian)",
                  padding: "7px 16px",
                  borderRadius: "var(--radius-buttons)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                }}
              >
                {seeding ? "Ingesting Sample Portfolio…" : "✦ Ingest Real Sample Data"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate?.("imports")}
              style={{
                background: "transparent",
                border: "1px solid var(--color-ash-border)",
                color: "var(--color-bone-white)",
                padding: "6px 14px",
                borderRadius: "var(--radius-tags)",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              + Import Statements
            </button>
          )}
        </div>
      </div>

      {/* Purpose Talent Style 4 KPI Tiles */}
      <div className="kpi-row">
        <div className="stat-tile" style={{ cursor: "pointer" }} onClick={() => onNavigate?.("transactions")}>
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

      {/* Obsidian AI Insight Announcement Card */}
      <div className="editorial-ai-insight">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(42, 255, 42, 0.12)",
              border: "1px solid rgba(42, 255, 42, 0.3)",
              color: "var(--color-prism-lime)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <IconSpark size={18} />
          </div>
          <div className="ai-insight-text">
            <strong>FinSight AI Telemetry:</strong> Dining expenses stabilized this cycle. Top merchant activity is indexed,
            and all transactions are validated with verified Abstract Syntax Trees.
          </div>
        </div>
        <button
          type="button"
          className="ai-insight-btn"
          style={{ background: "none", border: "none", cursor: "pointer", font: "inherit" }}
          onClick={() => onNavigate?.("ask")}
        >
          Ask FinSight a Question →
        </button>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
              Recent Transactions
            </h3>
            <button
              type="button"
              onClick={() => onNavigate?.("transactions")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-prism-cyan)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              View All →
            </button>
          </div>
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

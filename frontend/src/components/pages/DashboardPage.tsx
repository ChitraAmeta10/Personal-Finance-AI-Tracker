import { ReactNode, useEffect, useState } from "react";
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
import { IconCoins, IconScale, IconTrendUp, IconWallet } from "../../icons";
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
        setError("Could not reach the API — is the backend running?");
      }
    })();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading…</div>;

  const current = data.monthly.at(-1);
  const previous = data.monthly.at(-2);
  const categoryName = (id: number | null) =>
    id === null ? null : (data.categories.find((c) => c.id === id)?.name ?? null);
  const delta =
    current && previous && Number(previous.spent) !== 0
      ? ((Number(current.spent) - Number(previous.spent)) / Number(previous.spent)) * 100
      : null;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="banner">
        <div className="hi">{greeting()}</div>
        <h1>Welcome back, {displayName()}</h1>
        <p>Here's what's happening with your money. Everything below updates the moment you import a statement.</p>
        <span className="badge">AI tracked</span>
      </div>

      <div className="grid kpi-row">
        <StatTile
          accent="var(--brand)"
          icon={<IconCoins size={17} />}
          label="Spent this month"
          value={current ? money(current.spent) : "—"}
          sub={delta !== null ? `${delta >= 0 ? "+" : ""}${delta.toFixed(0)}% vs last month` : undefined}
        />
        <StatTile
          accent="var(--gold)"
          icon={<IconTrendUp size={17} />}
          label="Income this month"
          value={current ? money(current.income) : "—"}
        />
        <StatTile
          accent="var(--series-5)"
          icon={<IconScale size={17} />}
          label="Net this month"
          value={current ? money(current.net) : "—"}
          bad={current ? Number(current.net) < 0 : false}
        />
        <StatTile
          accent="var(--series-1)"
          icon={<IconWallet size={17} />}
          label="Accounts"
          value={String(data.accountCount)}
        />
      </div>

      <div className="grid charts-row">
        <div className="card">
          <h2>Spending trend</h2>
          <TrendChart data={data.monthly} />
        </div>
        <div className="card">
          <h2>Spend by category</h2>
          <CategoryDonut data={data.byCategory} />
        </div>
      </div>

      <div className="grid split-row">
        <div className="card">
          <h2>Top merchants</h2>
          <TopMerchants data={data.merchants} />
        </div>
        <div className="card">
          <h2>Recent transactions</h2>
          {data.transactions.length === 0 ? (
            <div className="empty">Nothing yet — import a statement to get started.</div>
          ) : (
            <table>
              <tbody>
                {data.transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{txn.txn_date}</td>
                    <td>{txn.merchant_normalized ?? txn.merchant_raw}</td>
                    <td>
                      <span className={`pill${txn.category_id === null ? " muted" : ""}`}>
                        {categoryName(txn.category_id) ?? "uncategorized"}
                      </span>
                    </td>
                    <td className="num" style={Number(txn.amount) > 0 ? { color: "var(--delta-good)" } : undefined}>
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

function StatTile({
  accent,
  icon,
  label,
  value,
  sub,
  bad,
}: {
  accent: string;
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  bad?: boolean;
}) {
  return (
    <div className="card stat-tile" style={{ ["--accent" as string]: accent }}>
      <div className="top">
        <span className="label">{label}</span>
        <span className="icon-chip">{icon}</span>
      </div>
      <div className="value" style={bad ? { color: "var(--critical)" } : undefined}>
        {value}
      </div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money, MonthlySummary } from "../api";

function monthLabel(ym: string): string {
  const [year, month] = ym.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString(undefined, { month: "short" });
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="viz-tooltip">
      <div className="title">{label}</div>
      {payload.map((entry) => (
        <div className="row" key={entry.dataKey}>
          <span>
            <span className="swatch" style={{ background: entry.stroke, marginRight: 5 }} />
            {entry.name}
          </span>
          <span className="val">{money(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ data }: { data: MonthlySummary[] }) {
  if (data.length === 0) return <div className="empty">No history yet — upload a statement.</div>;
  const rows = data.map((row) => ({
    month: monthLabel(row.month),
    spent: Number(row.spent),
    income: Number(row.income),
  }));

  return (
    <div>
      <div style={{ height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
            <CartesianGrid stroke="var(--grid)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              axisLine={{ stroke: "var(--axis)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              tickFormatter={(v: number) => money(v)}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--axis)" }} />
            <Line
              name="spent"
              dataKey="spent"
              stroke="var(--series-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--surface-1)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Line
              name="income"
              dataKey="income"
              stroke="var(--series-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: "var(--surface-1)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="legend">
        <span>
          <span className="swatch" style={{ background: "var(--series-1)" }} />
          spent
        </span>
        <span>
          <span className="swatch" style={{ background: "var(--series-2)" }} />
          income
        </span>
      </div>
    </div>
  );
}

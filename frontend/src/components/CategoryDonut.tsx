import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CategorySpend, money } from "../api";

const SLOTS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)", "var(--series-5)"];
const MAX_SEGMENTS = 6; // top 5 + "Other" — past that a donut stops being readable

interface Segment {
  name: string;
  value: number;
  color: string;
}

function toSegments(data: CategorySpend[]): Segment[] {
  const sorted = [...data].sort((a, b) => Number(b.total_spent) - Number(a.total_spent));
  const head = sorted.slice(0, MAX_SEGMENTS - 1);
  const tail = sorted.slice(MAX_SEGMENTS - 1);
  const segments: Segment[] = head.map((row, i) => ({
    name: row.category,
    value: Number(row.total_spent),
    color: SLOTS[i],
  }));
  if (tail.length > 0) {
    segments.push({
      name: tail.length === 1 ? tail[0].category : "other",
      value: tail.reduce((sum, row) => sum + Number(row.total_spent), 0),
      color: "var(--other)",
    });
  }
  return segments;
}

function SegmentTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const segment = payload[0].payload as Segment & { total: number };
  return (
    <div className="viz-tooltip">
      <div className="title">{segment.name}</div>
      <div className="row">
        <span className="val">{money(segment.value)}</span>
        <span>{((segment.value / segment.total) * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}

export function CategoryDonut({ data }: { data: CategorySpend[] }) {
  if (data.length === 0) return <div className="empty">No spending yet — upload a statement.</div>;
  const segments = toSegments(data);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const withTotal = segments.map((s) => ({ ...s, total }));

  return (
    <div>
      <div style={{ position: "relative", height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={withTotal}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={0}
              stroke="var(--surface-1)"
              strokeWidth={2} /* the 2px surface gap between fills */
              isAnimationActive={false}
            >
              {withTotal.map((segment) => (
                <Cell key={segment.name} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip content={<SegmentTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* hero figure in the hole — same sans, proportional figures */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            textAlign: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 26, fontWeight: 650 }}>{money(total)}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>total spent</div>
          </div>
        </div>
      </div>
      <div className="legend">
        {withTotal.map((segment) => (
          <span key={segment.name}>
            <span className="swatch" style={{ background: segment.color }} />
            {segment.name} · {((segment.value / total) * 100).toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

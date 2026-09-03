import { MerchantSpend, money } from "../api";

export function TopMerchants({ data }: { data: MerchantSpend[] }) {
  if (data.length === 0) {
    return <div className="empty">No recorded merchants yet.</div>;
  }
  const max = Number(data[0].total_spent) || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((row, idx) => {
        const rank = String(idx + 1).padStart(2, "0");
        const ratio = (Number(row.total_spent) / max) * 100;

        return (
          <div
            key={row.merchant}
            title={`${row.transaction_count} transaction${row.transaction_count === 1 ? "" : "s"}`}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr auto",
              gap: 12,
              alignItems: "center",
              paddingBottom: 10,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                fontStyle: "italic",
                color: "var(--gold)",
              }}
            >
              {rank}
            </span>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginBottom: 6,
                }}
              >
                {row.merchant}
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 999,
                  background: "var(--grid)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${ratio}%`,
                    borderRadius: 999,
                    background: "var(--brand)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              {money(row.total_spent)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

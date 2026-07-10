import { MerchantSpend, money } from "../api";

/**
 * Ranked one-series list: every bar wears the same hue (a value ramp on
 * nominal categories would double-encode what bar length already shows).
 */
export function TopMerchants({ data }: { data: MerchantSpend[] }) {
  if (data.length === 0) return <div className="empty">No merchants yet.</div>;
  const max = Number(data[0].total_spent);
  return (
    <div>
      {data.map((row) => (
        <div className="merchant-row" key={row.merchant} title={`${row.transaction_count} transactions`}>
          <span className="name">{row.merchant}</span>
          <span className="amount">{money(row.total_spent)}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(Number(row.total_spent) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Account, api, Category, money, Transaction } from "../../api";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountId, setAccountId] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void Promise.all([api.accounts(), api.categories()]).then(([a, c]) => {
      setAccounts(a);
      setCategories(c);
    });
  }, []);

  useEffect(() => {
    setTransactions(null);
    void api.transactions(200, accountId || undefined).then(setTransactions);
  }, [accountId]);

  const categoryName = (id: number | null) =>
    id === null ? null : (categories.find((c) => c.id === id)?.name ?? null);

  const visible = useMemo(() => {
    if (!transactions) return null;
    const needle = search.trim().toLowerCase();
    if (!needle) return transactions;
    return transactions.filter((txn) =>
      [txn.merchant_raw, txn.merchant_normalized, txn.description, categoryName(txn.category_id)]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle)),
    );
  }, [transactions, search, categories]);

  return (
    <div>
      <div className="page-head">
        <h1>Transactions</h1>
        <span className="crumb">{visible ? `${visible.length} shown` : ""}</span>
      </div>
      <div className="card">
        <div className="filter-row">
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">All accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          <input
            type="search"
            placeholder="Search merchant, description, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {visible === null ? (
          <div className="empty">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="empty">No matching transactions.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Description</th>
                <th>Category</th>
                <th>Source</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)" }}>{txn.txn_date}</td>
                  <td>{txn.merchant_normalized ?? txn.merchant_raw}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {txn.description ?? "—"}
                  </td>
                  <td>
                    <span className={`pill${txn.category_id === null ? " muted" : ""}`}>
                      {categoryName(txn.category_id) ?? "uncategorized"}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${txn.categorization_source === "llm" ? "gold" : "muted"}`}>
                      {txn.categorization_source}
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
  );
}

import { useEffect, useState } from "react";
import { Account, api, ImportBatch } from "../../api";
import { UploadPanel } from "../UploadPanel";
import { Page } from "../Shell";

export function ImportsPage({ onNavigate }: { onNavigate?: (page: Page) => void }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [batches, setBatches] = useState<ImportBatch[]>([]);

  const refresh = () => {
    void api.accounts().then(setAccounts);
    void api.importBatches().then(setBatches);
  };
  useEffect(refresh, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <span className="editorial-kicker">STATEMENT INGESTION</span>
          <h1>Bring your statements.</h1>
          <p className="editorial-lead" style={{ margin: 0 }}>
            Upload a CSV and let FinSight organize your financial activity.
          </p>
        </div>
        <span className="crumb">{batches.length} batches recorded</span>
      </div>

      <div className="grid split-row">
        <div className="card">
          <span className="editorial-kicker">INGESTION PORTAL</span>
          <h2>Upload a Statement</h2>
          {accounts === null ? (
            <div className="empty">Loading accounts…</div>
          ) : (
            <UploadPanel accounts={accounts} onDataChanged={refresh} onNavigate={onNavigate} />
          )}
        </div>

        <div className="card">
          <span className="editorial-kicker">AUDIT LEDGER</span>
          <h2>Import History</h2>
          {batches.length === 0 ? (
            <div className="empty">No past statements on record. Ingest a CSV to see audit records.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>File</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Imported</th>
                  <th style={{ textAlign: "right" }}>Duplicates</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id}>
                    <td
                      style={{
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                      }}
                    >
                      {batch.filename}
                    </td>
                    <td>
                      <span className={`pill ${batch.status === "completed" ? "" : "red"}`}>
                        {batch.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="num">
                      {batch.imported_rows}/{batch.total_rows}
                    </td>
                    <td className="num" style={{ color: "var(--color-fog-blue)" }}>
                      {batch.duplicate_rows}
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

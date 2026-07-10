import { useEffect, useState } from "react";
import { Account, api, ImportBatch } from "../../api";
import { UploadPanel } from "../UploadPanel";

export function ImportsPage() {
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
        <h1>Imports</h1>
        <span className="crumb">CSV statements in, categorized transactions out</span>
      </div>
      <div className="grid split-row">
        <div className="card">
          <h2>Upload a statement</h2>
          {accounts === null ? (
            <div className="empty">Loading…</div>
          ) : (
            <UploadPanel accounts={accounts} onDataChanged={refresh} />
          )}
        </div>
        <div className="card">
          <h2>Import history</h2>
          {batches.length === 0 ? (
            <div className="empty">No imports yet.</div>
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
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {batch.filename}
                    </td>
                    <td>
                      <span className={`pill ${batch.status === "completed" ? "" : "red"}`}>{batch.status}</span>
                    </td>
                    <td className="num">
                      {batch.imported_rows}/{batch.total_rows}
                    </td>
                    <td className="num">{batch.duplicate_rows}</td>
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

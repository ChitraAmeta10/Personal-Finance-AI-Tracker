import { api } from "./api";

export const SAMPLE_CSV_CONTENT = `Date,Description,Amount
2026-03-04,TRADER JOES #522 FOLSOM ST SAN FRANCISCO,-84.20
2026-03-03,BLUE BOTTLE COFFEE HAYES VALLEY,-6.75
2026-03-03,SWEETGREEN FINANCIAL DISTRICT,-17.40
2026-03-02,UBER TRIP HELP.UBER.COM,-24.50
2026-03-01,EQUINOX FITNESS SF MONTHLY DUES,-260.00
2026-03-01,ACH DEPOSIT TECH CORP SALARY,4850.00
2026-02-28,APPLE STORE R342 UNION SQUARE,-149.00
2026-02-28,DELTA AIR LINES 0062819201824,-382.40
2026-02-26,WHOLE FOODS MARKET SOMA,-62.10
2026-02-25,NETFLIX.COM MONTHLY SUBSCRIPTION,-22.99
2026-02-24,SPOTIFY USA MONTHLY PREMIUM,-11.99
2026-02-22,CHIPOTLE MEXICAN GRILL #1920,-14.25
2026-02-20,TARTINE BAKERY MISSION,-18.90
2026-02-18,GITHUB COPILOT SUBSCRIPTION,-21.00
2026-02-15,ACH DEPOSIT TECH CORP SALARY,4850.00
2026-02-14,BLUE BOTTLE COFFEE SOMA,-7.20
2026-02-12,TRADER JOES #522 GROCERIES,-95.40
2026-02-10,LYFT RIDE AIRPORT SF,-42.80
2026-02-05,AMAZON.COM ELECTRONICS & CABLES,-46.80
2026-02-01,RESIDENTIAL RENT ELECTRONIC PAYMENT,-2400.00
`;

export function downloadSampleCSV(): void {
  const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "finsight_sample_statement.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function seedSamplePortfolio(): Promise<{ accountId: string; importedRows: number }> {
  // 1. Check or create primary account
  const accounts = await api.accounts();
  let targetAccount = accounts.find((a) => a.name.includes("Checking")) ?? accounts[0];

  if (!targetAccount) {
    targetAccount = await api.createAccount("Chase Sapphire Checking", "checking");
    // Optionally create a secondary card for realism
    await api.createAccount("Amex Platinum Card", "credit_card");
  }

  // 2. Create CSV File from sample content
  const file = new File([SAMPLE_CSV_CONTENT], "statement_q1_2026.csv", { type: "text/csv" });

  // 3. Upload statement to target account
  const batch = await api.upload(targetAccount.id, file);

  // 4. Run categorization
  await api.categorize();

  return { accountId: targetAccount.id, importedRows: batch.imported_rows };
}

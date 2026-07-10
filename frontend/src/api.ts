const API = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export interface Account {
  id: string;
  name: string;
  account_type: string;
  currency: string;
}
export interface Transaction {
  id: string;
  account_id: string;
  txn_date: string;
  merchant_raw: string;
  merchant_normalized: string | null;
  description: string | null;
  amount: string; // Decimal serialized as string
  currency: string;
  category_id: number | null;
  categorization_source: string;
}
export interface Category {
  id: number;
  name: string;
}
export interface CategorySpend {
  category: string;
  total_spent: string;
  transaction_count: number;
}
export interface MonthlySummary {
  month: string;
  spent: string;
  income: string;
  net: string;
}
export interface MerchantSpend {
  merchant: string;
  total_spent: string;
  transaction_count: number;
}
export interface ImportBatch {
  id: string;
  filename: string;
  status: string;
  total_rows: number;
  imported_rows: number;
  duplicate_rows: number;
  error: string | null;
}
export interface CategorizationRun {
  total: number;
  rule_categorized: number;
  llm_categorized: number;
  still_uncategorized: number;
  llm_error: string | null;
}
export interface MethodStats {
  transactions_total: number;
  by_source: Record<string, number>;
  compared: number;
  agreements: number;
  agreement_rate: number | null;
}
export interface NLQueryResult {
  question: string;
  sql: string;
  columns: string[];
  rows: (string | number | null)[][];
  row_count: number;
  latency_ms: number;
}
export interface NLQueryHistoryItem {
  id: string;
  question: string;
  generated_sql: string | null;
  status: "executed" | "rejected" | "failed";
  row_count: number | null;
  error: string | null;
  created_at: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let token: string | null = localStorage.getItem("token");

export const auth = {
  isLoggedIn: () => token !== null,
  email: () => localStorage.getItem("email"),
  logout() {
    token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  },
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const resp = await fetch(`${API}${path}`, { ...init, headers });
  if (resp.status === 401 && token) {
    auth.logout();
    window.location.reload();
  }
  if (!resp.ok) {
    let detail = resp.statusText;
    try {
      const body = await resp.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(resp.status, detail);
  }
  return resp.json() as Promise<T>;
}

function json(body: unknown): RequestInit {
  return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const api = {
  async register(email: string, password: string) {
    await request("/auth/register", json({ email, password }));
  },
  async login(email: string, password: string) {
    const body = new URLSearchParams({ username: email, password });
    const data = await request<{ access_token: string }>("/auth/login", { method: "POST", body });
    token = data.access_token;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  },
  accounts: () => request<Account[]>("/accounts"),
  createAccount: (name: string, account_type: string) =>
    request<Account>("/accounts", json({ name, account_type })),
  categories: () => request<Category[]>("/categories"),
  transactions: (limit = 12, accountId?: string) =>
    request<Transaction[]>(`/transactions?limit=${limit}${accountId ? `&account_id=${accountId}` : ""}`),
  importBatches: () => request<ImportBatch[]>("/uploads"),
  stats: () => request<MethodStats>("/categorization/stats"),
  ask: (question: string) => request<NLQueryResult>("/nlq", json({ question })),
  askHistory: () => request<NLQueryHistoryItem[]>("/nlq/history"),
  byCategory: () => request<CategorySpend[]>("/insights/by-category"),
  monthly: (months = 12) => request<MonthlySummary[]>(`/insights/monthly?months=${months}`),
  topMerchants: (limit = 8) => request<MerchantSpend[]>(`/insights/top-merchants?limit=${limit}`),
  upload(accountId: string, file: File) {
    const body = new FormData();
    body.append("account_id", accountId);
    body.append("file", file);
    return request<ImportBatch>("/uploads", { method: "POST", body });
  },
  categorize: () => request<CategorizationRun>("/categorization/run", { method: "POST" }),
};

export const money = (value: string | number, currency = "USD"): string =>
  Number(value).toLocaleString(undefined, { style: "currency", currency, maximumFractionDigits: 0 });

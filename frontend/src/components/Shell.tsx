import { ReactNode } from "react";
import { auth } from "../api";
import {
  IconGrid,
  IconList,
  IconOut,
  IconSpark,
  IconTarget,
  IconUpload,
  IconWallet,
  LogoMark,
} from "../icons";

export type Page = "dashboard" | "transactions" | "accounts" | "imports" | "ask" | "accuracy";

const NAV: { section: string; items: { page: Page; label: string; icon: ReactNode }[] }[] = [
  {
    section: "OVERVIEW",
    items: [
      { page: "dashboard", label: "Dashboard", icon: <IconGrid size={16} /> },
    ],
  },
  {
    section: "MONEY",
    items: [
      { page: "transactions", label: "Transactions", icon: <IconList size={16} /> },
      { page: "accounts", label: "Accounts", icon: <IconWallet size={16} /> },
      { page: "imports", label: "Imports", icon: <IconUpload size={16} /> },
    ],
  },
  {
    section: "INTELLIGENCE",
    items: [
      { page: "ask", label: "Ask FinSight", icon: <IconSpark size={16} /> },
      { page: "accuracy", label: "AI Accuracy", icon: <IconTarget size={16} /> },
    ],
  },
];

interface Props {
  page: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function Shell({ page, onNavigate, onLogout, children }: Props) {
  const email = auth.email() ?? "";
  const initials = email.slice(0, 2).toUpperCase() || "FS";

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-row">
          <span className="logo-mark">
            <LogoMark size={16} />
          </span>
          <span className="name">
            Fin<em>Sight</em>
          </span>
        </div>

        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: 12 }}>
            <div className="nav-section">{group.section}</div>
            {group.items.map((item) => (
              <button
                key={item.page}
                type="button"
                className={`nav-item${page === item.page ? " active" : ""}`}
                onClick={() => onNavigate(item.page)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="spacer" />

        <div className="nav-section" style={{ padding: "8px 12px 4px" }}>SYSTEM</div>
        <div className="user-card">
          <span className="avatar">{initials}</span>
          <span className="who">
            <span className="email" title={email}>{email}</span>
            <span className="role">Verified Enclave</span>
          </span>
          <button className="out" onClick={onLogout} title="Sign out" aria-label="Sign out">
            <IconOut size={16} />
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

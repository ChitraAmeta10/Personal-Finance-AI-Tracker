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
    section: "Overview",
    items: [
      { page: "dashboard", label: "Dashboard", icon: <IconGrid /> },
      { page: "transactions", label: "Transactions", icon: <IconList /> },
      { page: "accounts", label: "Accounts", icon: <IconWallet /> },
    ],
  },
  {
    section: "AI tools",
    items: [
      { page: "ask", label: "Ask AI", icon: <IconSpark /> },
      { page: "accuracy", label: "AI accuracy", icon: <IconTarget /> },
    ],
  },
  {
    section: "Data",
    items: [{ page: "imports", label: "Imports", icon: <IconUpload /> }],
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
  const initials = email.slice(0, 2).toUpperCase();

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
          <div key={group.section}>
            <div className="nav-section">{group.section}</div>
            {group.items.map((item) => (
              <button
                key={item.page}
                className={`nav-item${page === item.page ? " active" : ""}`}
                onClick={() => onNavigate(item.page)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        ))}
        <div className="spacer" />
        <div className="user-card">
          <span className="avatar">{initials}</span>
          <span className="who">
            <span className="email">{email}</span>
            <span className="role">Member</span>
          </span>
          <button className="out" onClick={onLogout} title="Sign out">
            <IconOut />
          </button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

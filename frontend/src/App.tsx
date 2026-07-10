import { useState } from "react";
import { auth } from "./api";
import { Landing } from "./components/Landing";
import { Login } from "./components/Login";
import { Page, Shell } from "./components/Shell";
import { AccountsPage } from "./components/pages/AccountsPage";
import { AccuracyPage } from "./components/pages/AccuracyPage";
import { AskPage } from "./components/pages/AskPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ImportsPage } from "./components/pages/ImportsPage";
import { TransactionsPage } from "./components/pages/TransactionsPage";

type View = "landing" | "auth" | "app";

const PAGES: Record<Page, () => JSX.Element> = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  accounts: AccountsPage,
  imports: ImportsPage,
  ask: AskPage,
  accuracy: AccuracyPage,
};

export default function App() {
  const [view, setView] = useState<View>(auth.isLoggedIn() ? "app" : "landing");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [page, setPage] = useState<Page>("dashboard");

  if (view === "landing") {
    return (
      <Landing
        onGetStarted={() => {
          setAuthMode("register");
          setView("auth");
        }}
        onSignIn={() => {
          setAuthMode("login");
          setView("auth");
        }}
      />
    );
  }

  if (view === "auth") {
    return <Login initialMode={authMode} onLogin={() => setView("app")} onBack={() => setView("landing")} />;
  }

  const Current = PAGES[page];
  return (
    <Shell
      page={page}
      onNavigate={setPage}
      onLogout={() => {
        auth.logout();
        setPage("dashboard");
        setView("landing");
      }}
    >
      <Current />
    </Shell>
  );
}

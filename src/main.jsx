import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Basix from "./App.jsx";
import Cards from "./App2.jsx";
import CompaniesPage from "./CompaniesPage.jsx";
import InsightsPage from "./InsightsPage.jsx";
import { COMPANY_PROFILES, DEFAULT_SYMBOL } from "./companyData.js";

const NAV_ITEMS = [
  { key: "all", label: "All" },
  { key: "dashboard", label: "Dashboard" },
  { key: "companies", label: "Companies" },
  { key: "insights", label: "Insights" },
  { key: "news", label: "News" },
];

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanName = username.trim();
    if (!cleanName || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    onLogin(cleanName);
  };


  return (
    <section className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>This is a frontend-only demo login. No backend auth is used.</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </section>
  );
}

function Header({ username, view, onViewChange, onLogout, selectedSymbol }) {
  return (
    <header className="site-header">
      <h2>StockMark</h2>
      <nav className="site-nav">
        {NAV_ITEMS.map((item) => (
          <button
            className={view === item.key ? "active" : ""}
            key={item.key}
            onClick={() => onViewChange(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-right">
        <span className="active-symbol-chip">{selectedSymbol}</span>
        <span>Hi, {username}</span>
        <button className="logout-btn" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
}

function AppShell() {
  const [username, setUsername] = useState(() => localStorage.getItem("demoUser") || "");
  const [view, setView] = useState("all");
  const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_SYMBOL);

  const handleLogin = (name) => {
    localStorage.setItem("demoUser", name);
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem("demoUser");
    setUsername("");
    setView("all");
    setSelectedSymbol(DEFAULT_SYMBOL);
  };

  const handleSelectSymbol = (symbol) => {
    const normalized = typeof symbol === "string" ? symbol.trim().toUpperCase() : "";
    if (!normalized) {
      return;
    }

    setSelectedSymbol(normalized);
  };

  if (!username) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Header
        username={username}
        view={view}
        onViewChange={setView}
        onLogout={handleLogout}
        selectedSymbol={selectedSymbol}
      />
      {(view === "all" || view === "dashboard") && (
        <Basix
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
          companyProfiles={COMPANY_PROFILES}
        />
      )}
      {(view === "all" || view === "companies") && (
        <CompaniesPage
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
          onOpenDashboard={() => setView("dashboard")}
        />
      )}
      {(view === "all" || view === "insights") && (
        <InsightsPage
          companyProfiles={COMPANY_PROFILES}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={handleSelectSymbol}
          onOpenDashboard={() => setView("dashboard")}
        />
      )}
      {(view === "all" || view === "news") && <Cards />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppShell />
  </StrictMode>
);
